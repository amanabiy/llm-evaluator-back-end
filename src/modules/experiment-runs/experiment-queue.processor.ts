import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TestCaseResultsService } from '../test-case-results/test-case-results.service';
import { TestCaseResult, TestCaseStatus } from '../test-case-results/entities/test-case-result.entity';
import { ExperimentRunsService } from './experiment-runs.service';
import { HttpException, HttpStatus, Logger, NotImplementedException } from '@nestjs/common';
import { Job } from 'bullmq';  // Import Job for typing
import { GroqIntegrationService } from '../llm/groq/qroq.service';  // Import GroqIntegrationService
import { EvaluationMethod } from '../test-cases/entities/test-case.entity';

interface RunExperimentJobData {
    experimentRunId: string;
    testCaseResultId: string;
}

@Processor('run-experiment')  // Queue name
export class ExperimentRunQueueWorker extends WorkerHost {
    private readonly logger = new Logger(ExperimentRunQueueWorker.name);

    constructor(
        private readonly testCaseResultsService: TestCaseResultsService,
        private readonly experimentRunsService: ExperimentRunsService,
        private readonly groqIntegrationService: GroqIntegrationService,  // Inject GroqIntegrationService
    ) {
        super();  // Call the constructor of WorkerHost
    }

    // Method to process jobs from the 'run-experiment' queue
    async process(job: Job<RunExperimentJobData, any, string>): Promise<any> {
        const { experimentRunId, testCaseResultId } = job.data;
        const testCaseResult = await this.testCaseResultsService.getTestCaseResultById(testCaseResultId);
        const startTime = performance.now();
        try {
            // Fetch the TestCaseResult by ID
            if (!testCaseResult) {
                this.logger.error(`TestCaseResult with ID ${testCaseResultId} not found`);
                return;
            }

            // Update the status of the test case result to 'IN_PROGRESS'
            await this.testCaseResultsService.updateTestCaseResultStatus(testCaseResultId, TestCaseStatus.IN_PROGRESS);

            // Process the test case result (Simulating test case execution)
            this.logger.log(`Processing TestCaseResult for ExperimentRun ID ${experimentRunId}, TestCaseResult ID ${testCaseResultId}`);

            // Run the test case using the Groq API
            await this.runTestCase(testCaseResult);

            // If we reach this stage it means the testCase have been evaluated and the appropreat scores and lattency have been set
            // so we mark it as complete
            testCaseResult.status = TestCaseStatus.COMPLETED

            const endTime = performance.now();
            const latency = endTime - startTime;
            testCaseResult.latency = latency;
            this.logger.log(`response for TestCaseResult ${testCaseResult.id} took ${latency.toFixed(2)} ms`);
            await this.testCaseResultsService.update(testCaseResult.id, testCaseResult);
            // Check if all test case results for this experiment run are completed
            await this.experimentRunsService.checkAndCompleteExperimentRun(experimentRunId);

        } catch (error) {

            const endTime = performance.now();
            const latency = endTime - startTime;
            this.logger.error(`Error processing TestCaseResult for TestCaseResult ID ${testCaseResultId}`, error.stack);
            this.logger.error(`Job ${job.id} failed on attempt ${job.attemptsMade}`);
            
            // on the third attempt give up and just save the failed one
            if (job.attemptsMade + 1 === 3) {
                testCaseResult.status = TestCaseStatus.FAILED
                testCaseResult.latency = latency;
                await this.testCaseResultsService.update(testCaseResult.id, testCaseResult);
            }
            throw new HttpException(`Error processing TestCaseResult for TestCaseResult ID ${testCaseResultId}`, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    // Simulate running the test case using Groq API
    private async runTestCase(testCaseResult: TestCaseResult): Promise<TestCaseResult> {
        const test_case = testCaseResult.test_case;
        const prompt = testCaseResult.test_case.prompt;  // Use description or default prompt
        const llmModel = testCaseResult.llm_model || 'llama-3.3-70b-versatile';  // Use the model from testCaseResult if available
        const groqResponse = await this.groqIntegrationService.generateResponse(prompt, 100, 1, llmModel);
        testCaseResult.response = groqResponse;
        if (test_case.evaluation_method === EvaluationMethod.EXACT_MATCH) {
            // Implement the exact match evaluation
            // throw new NotImplementedException("JSON output evaluation method is not implemented yet.");
            this.evaluateExactMatch(testCaseResult, groqResponse);
        } else if (test_case.evaluation_method === EvaluationMethod.JSON_OUTPUT) {
            // This will throw an exception as the method is not implemented yet
            throw new NotImplementedException("JSON output evaluation method is not implemented yet.");
        } else {
            // Default to calling the Groq API to generate a response based on the LLM model and prompt
            throw new NotImplementedException("LLM Evaluation method is not implemented yet.");
        }

        return testCaseResult;
    }

    // Exact match evaluation (to be implemented based on your needs)
    private async evaluateExactMatch(testCaseResult: TestCaseResult, response: string): Promise<TestCaseResult> {
        // Example implementation:
        // You would compare the generated response with the expected output here.
        const expectedOutput = testCaseResult.test_case.expected_response; // Assuming expected_output is part of the test case
        const prompt = testCaseResult.description;

        // Example of calling the Groq API

        // Check for exact match
        if (response.trim() === expectedOutput.trim()) {
            this.logger.log(`Exact match found for TestCaseResult ${testCaseResult.id}`);
            testCaseResult.accuracy = 100;
        } else {
            this.logger.error(`Exact match failed for TestCaseResult ${testCaseResult.id}`);
            testCaseResult.accuracy = 0;
        }
        return testCaseResult;
    }
}
