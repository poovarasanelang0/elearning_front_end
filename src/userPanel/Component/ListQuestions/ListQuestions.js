import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import { getCourseQuestion } from "../../../api/question";
import { saveAnswers } from "../../../api/result";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { GiSpeaker } from "react-icons/gi";
import { getuserId } from "../../../utils/Storage";
import { getSingleUser } from "../../../api/user";

const ListQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({ totalQuestions: 0, correctAnswers: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [testStatus, setTestStatus] = useState("incomplete");
  const [userDetails, setUserDetails] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const courseId = new URLSearchParams(location.search).get("id");


  useEffect(() => {
    const userId = getuserId();
    console.log("Decrypted User ID:", userId); // Add this
    if (userId) {
      getUserDetails(userId);
    } else {
      toast.error("User is not logged in. Redirecting to login page.");
    }
  }, []);
  
  

  const getUserDetails = async (id) => {
    try {
      const res = await getSingleUser(id);
      setUserDetails(res?.data?.result);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchQuestions();
    }
  }, [courseId]);

  const fetchQuestions = async () => {
    try {
      const res = await getCourseQuestion(courseId);
      if (res?.data?.result && Array.isArray(res.data.result)) {
        setQuestions(res.data.result);
        setAnswers(
          res.data.result.map((q) => ({
            questionId: q._id,
            question: q.question,
            selectedAnswer: "",
            correctAnswer: q.answer || "",
          }))
        );
        setStats({ totalQuestions: res.data.result.length, correctAnswers: 0 });
      } else {
        console.warn("Unexpected response structure:", res);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      toast.error("Failed to fetch questions.");
    }
  };

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) {
      toast.error("Text-to-Speech is not supported on this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerChange = (questionId, value) => {
    const updatedAnswers = answers.map((ans) =>
      ans.questionId === questionId ? { ...ans, selectedAnswer: value } : ans
    );
    setAnswers(updatedAnswers);
    calculateStats(updatedAnswers);
  };

  const calculateStats = (updatedAnswers) => {
    const correctCount = updatedAnswers.filter(
      (ans) => ans.selectedAnswer === ans.correctAnswer
    ).length;
    const total = updatedAnswers.length;
    const percentage = Math.round((correctCount / total) * 100);
    setStats({ totalQuestions: total, correctAnswers: correctCount });
    setPercentage(percentage);
    setTestStatus(percentage >= 80 ? "complete" : "incomplete");
  };

  const validateAnswers = () => {
    const newErrors = {};
    answers.forEach((ans, index) => {
      if (!ans.selectedAnswer) {
        newErrors[index] = "Please select an answer for this question.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (validateAnswers()) {
  //     try {
  //       const payload = {
  //         userId: userDetails?._id,
  //         courseId,
  //         answers,
  //         totalQuestions: stats.totalQuestions,
  //         correctAnswers: stats.correctAnswers,
  //         percentage,
  //         testStatus,
          
  //       };

  //       const res = await saveAnswers(payload);
  //       toast.success(res?.data?.message || "Answers saved successfully.");
  //       setIsModalOpen(true);
  //     } catch (err) {
  //       console.error("Error saving answers:", err);
  //       toast.error(err?.response?.data?.message || "Failed to save answers.");
  //     }
  //   } else {
  //     toast.error("Please fix the errors before submitting.");
  //   }
  // };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateAnswers()) {
      try {
        const payload = {
          userId: userDetails?._id,
          courseId,
          answers,
          totalQuestions: stats.totalQuestions,
          correctAnswers: stats.correctAnswers,
          percentage,
          testStatus,
          attemptNumber: stats.attemptNumber, 
        };
  
        const res = await saveAnswers(payload);
        toast.success(res?.data?.message || "Answers saved successfully.");
        setIsModalOpen(true);
      } catch (err) {
        console.error("Error saving answers:", err);
        toast.error(err?.response?.data?.message || "Failed to save answers.");
      }
    } else {
      toast.error("Please fix the errors before submitting.");
    }
  };
  
  

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/UserDashboard");
  };

  return (
    <>
      <Header />
      <div className="container mt-5 my-5">
        <div className="row mt-4">
          <div className="col-md-12 mt-4">
            <h2 className="text-center mt-5">Test Questions</h2>
            <div className="text-center mb-3 mt-2">
              <p>Total Questions: {stats.totalQuestions}</p>
              <p>Correct Answers: {stats.correctAnswers}</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div className="card p-3 shadow-sm mb-3" key={question._id}>
              <div className="d-flex justify-content-between align-items-center">
                <h5>{question.question}</h5>
                <GiSpeaker
                  style={{ cursor: "pointer", color: "#007bff", fontSize: "1.5rem" }}
                  onClick={() => handleSpeak(question.question)}
                />
              </div>
              {errors[index] && <div className="text-danger">{errors[index]}</div>}
              {["option1", "option2", "option3", "option4"].map((option, optIndex) => (
                <div className="form-check" key={optIndex}>
                  <input
                    type="radio"
                    className="form-check-input"
                    name={`question-${question._id}`}
                    value={question[option]}
                    checked={
                      answers.find((ans) => ans.questionId === question._id)?.selectedAnswer ===
                      question[option]
                    }
                    onChange={() => handleAnswerChange(question._id, question[option])}
                  />
                  <label className="form-check-label">{question[option]}</label>
                </div>
              ))}
            </div>
          ))}
          <div className="text-center">
            <button type="submit" className="btn btn-primary">Submit Answers</button>
          </div>
        </form>
      </div>

      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Results Modal"
  style={{
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      textAlign: "center",
    },
  }}
>
  <h3>Results</h3>
  <div style={{ width: "150px", margin: "0 auto" }}>
    <CircularProgressbar
      value={percentage}
      text={`${percentage}%`}
      styles={buildStyles({
        textColor: "#000",
        pathColor: percentage >= 80 ? "green" : "red",
        trailColor: "#d6d6d6",
      })}
    />
  </div>
  {percentage >= 80 ? (
    <>
      <p>Congratulations! You passed with a score of <b>{percentage}%</b>.</p>
      <p>Keep up the great work!</p>
    </>
  ) : (
    <>
      <p>You failed. Review your answers below:</p>
      {answers.map((ans, idx) => (
        <div key={idx} className="mt-3 text-start">
          <h6>Q: {ans.question}</h6>
          <p>
            Your Answer:{" "}
            <span style={{ color: ans.selectedAnswer === ans.correctAnswer ? "green" : "red" }}>
              {ans.selectedAnswer || "Not Answered"}
            </span>
          </p>
          <p>Correct Answer: <b>{ans.correctAnswer}</b></p>
        </div>
      ))}
    </>
  )}
  <button className="btn btn-secondary mt-3" onClick={closeModal}>
    Close
  </button>
</Modal>

    </>
  );
};

export default ListQuestions;
