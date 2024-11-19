import React, { useEffect, useState } from "react";

// function Clock(){

// }

const BASE_URL = "http://10.202.100.187:9090/api";

interface SleepRecord {
  id: number;
  date: string;
  sleep_start_time: string;
  wake_up_time: string;
  total_sleep_duration: string;
}

export const DateTime = () => {
  const [date, setDate] = useState(new Date());
  const [sleepStarted, setSleepStarted] = useState(false); // State to track sleep status
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null); // State to store sleep start time

  // For table
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);

  useEffect(() => {
    console.log("inside clock useEffect");
    const timer = setInterval(() => setDate(new Date()), 1000);

    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  // Get data from API and put it in sleepRecords
  useEffect(() => {
    const fetchSleepRecords = async () => {
      const response = await fetch(`${BASE_URL}/sleep_log/sleep-records/`);
      // const sleepRecords = (await response.json()) as SleepRecord[];
      const sleepRecords = await response.json();
      console.log(sleepRecords);
      setSleepRecords(sleepRecords.data);
    };

    fetchSleepRecords();
  }, []);

  const handleStartSleep = () => {
    setSleepStarted(true); // Mark sleep as started
    setSleepStartTime(new Date()); // Record the start time
  };

  const handleWakeUp = async () => {
    setSleepStarted(false); // Mark sleep as ended
    const wakeUpTime = new Date();
    const sleepDuration =
      (wakeUpTime.getTime() - sleepStartTime!.getTime()) / 1000; // Calculate sleep duration in seconds // sleepStartTime! ensures that it is not null

    // Prepare the data to send
    const postData = {
      date: wakeUpTime.toISOString().split("T")[0], // Get the date in YYYY-MM-DD format
      sleep_start_time: sleepStartTime!.toTimeString().split(" ")[0], // Get the time in HH:MM:SS format
      wake_up_time: wakeUpTime.toTimeString().split(" ")[0], // Get the time in HH:MM:SS format
      total_sleep_duration: `${Math.floor(sleepDuration / 3600)
        .toString()
        .padStart(2, "0")}:${Math.floor((sleepDuration % 3600) / 60)
        .toString()
        .padStart(2, "0")}:${Math.floor(sleepDuration % 60)
        .toString()
        .padStart(2, "0")}`, // Convert seconds to HH:MM:SS
    };

    try {
      const response = await fetch(`${BASE_URL}/sleep_log/sleep-records/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensuring the correct content type
        },
        body: JSON.stringify(postData), // Convert the postData to JSON string
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Data posted successfully: ${JSON.stringify(result)}`);
        // Optionally, you could fetch updated records or update local state here
      } else {
        const errorText = await response.text();
        alert(`Error posting data: ${response.statusText}. ${errorText}`);
      }
    } catch (error) {
      console.error("Error during the POST request:", error);
      alert("An error occurred while posting the data.");
    }

    alert(`You slept for ${sleepDuration} seconds`);
    setSleepStarted(false);
    setSleepStartTime(null); // Reset the start time
  };

  return (
    <div>
      <p> Time : {date.toLocaleTimeString()}</p>
      <p> Date : {date.toLocaleDateString()}</p>

      {!sleepStarted ? (
        <button
          type="button"
          className="btn btn-dark"
          onClick={handleStartSleep}
        >
          START SLEEP
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleWakeUp}
        >
          WAKE UP!!!
        </button>
      )}

      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Date</th>
            <th scope="col">Sleep Start Time</th>
            <th scope="col">Wake Up Time</th>
            <th scope="col">Total Sleep Duration</th>
          </tr>
        </thead>
        <tbody>
          {sleepRecords.map((sleepRecord) => (
            <tr key={sleepRecord.id}>
              <td>{sleepRecord.id}</td>
              <td>{sleepRecord.date}</td>
              <td>{sleepRecord.sleep_start_time}</td>
              <td>{sleepRecord.wake_up_time}</td>
              <td>{sleepRecord.total_sleep_duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DateTime;
