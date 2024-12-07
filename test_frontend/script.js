let startTime;

function goToPage2() {
  const iqForm = document.getElementById("iq-form");
  if (iqForm.reportValidity()) {
    // Set start time if not already set
    if (!startTime) {
      startTime = Date.now();
    }
    document.getElementById("page1").classList.add("hidden");
    document.getElementById("page2").classList.remove("hidden");
  }
}

function submitQuiz() {
  const iqForm = document.getElementById("iq-form");
  const dyslexiaForm = document.getElementById("dyslexia-form");

  if (dyslexiaForm.reportValidity()) {
    // Collect data from both forms
    const iqData = new FormData(iqForm);
    const dyslexiaData = new FormData(dyslexiaForm);

    // Calculate IQ score (based on checked answers)
    const iqScore = Array.from(iqData.values()).filter((val) => val).length;

    // Get dyslexia-related data (1 for true, 0 for false)
    const dqScores = {
      Q1: parseInt(dyslexiaData.get("dq1")) || 0,
      Q2: parseInt(dyslexiaData.get("dq2")) || 0,
      Q3: parseInt(dyslexiaData.get("dq3")) || 0,
      Q4: parseInt(dyslexiaData.get("dq4")) || 0,
      Q5: parseInt(dyslexiaData.get("dq5")) || 0,
    };

    // Calculate the time taken in seconds
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    // Structure the data to send to the model
    const jsonData = {
      Age: 9, // This can be dynamic if you add age input
      IQ: iqScore,
      Q1: dqScores.Q1,
      Q2: dqScores.Q2,
      Q3: dqScores.Q3,
      Q4: dqScores.Q4,
      Q5: dqScores.Q5,
      "Time Seconds": timeTaken,
    };

    console.log("Data to be sent to the model:", JSON.stringify(jsonData, null, 2));

    // Send the data to the model via a POST request
    fetch("http://172.20.10.3:5001/predict_rac", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData), 
    })
      .then((response) => response.json())
      .then((data) => {
        displayResult(data.prediction); // Display the prediction result
      })
      .catch((err) => {
        console.error(err);
        console.log(response)
        alert("An error occurred while fetching the prediction.");
      });
  }
}

function displayResult(prediction) {
  // Hide the quiz page and display the result
  document.getElementById("page2").classList.add("hidden");
  const resultSection = document.getElementById("result");
  resultSection.classList.remove("hidden");
  document.getElementById("result-text").innerText = `Prediction: ${prediction}`;
}

function restartQuiz() {
  // Reset the quiz and start over
  document.getElementById("result").classList.add("hidden");
  document.getElementById("page1").classList.remove("hidden");
  document.getElementById("iq-form").reset();
  document.getElementById("dyslexia-form").reset();
  startTime = Date.now(); // Reset the timer
}
