const cron = require('node-cron');
const { main1234 } = require('./fsvzo-update-botV3'); // Adjust the filename as needed

let isTaskCompleted = false;

async function runWithTimeout() {
  isTaskCompleted = false; // Reset the completion flag

  await main1234().then(() => {
    isTaskCompleted = true;
    console.log('Task completed successfully');
  }).catch((error) => {
    console.error('Error in main function:', error);
  });

  setTimeout(() => {
    if (!isTaskCompleted) {
      console.log('Task did not complete within 15 minutes, retrying...');
      runWithTimeout(); // Retry the function
    }
  }, 900000); // 15 minutes in milliseconds
}

// Schedule to run at the specified time, using cron
cron.schedule('2 */4 * * *', () => { // Adjust your cron schedule as needed
  console.log('Scheduled task started');
  runWithTimeout();
});
runWithTimeout();
