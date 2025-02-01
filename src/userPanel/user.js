// Import necessary libraries
import React, { useState, useEffect } from "react";
import { deleteQuestion, getFilterQuestion } from "../api/question";
import Header from "./Component/Header/Header";

function QuizApp() {
  const [questions, setQuestions] = useState([]); // Initialize as an array
  const [selectedCourse, setSelectedCourse] = useState(""); // Default course

  useEffect(() => {
    fetchQuestions(selectedCourse);
  }, [selectedCourse]);

  const fetchQuestions = (course) => {
    const data = {
      limit: 10,
      course: course, // Pass selected course
    };
    getFilterQuestion(data)
      .then((res) => {
        setQuestions(res?.data?.result?.userList || []); // Safely handle undefined
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
      });
  };

  const handleDeleteQuestion = (id) => {
    deleteQuestion(id)
      .then(() => {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question.id !== id)
        );
      })
      .catch((err) => {
        console.error("Error deleting question:", err);
      });
  };

  return (
    <>
      <Header />

      <div className="container mt-5 ">
        <div className="row mt-5">
          <div className="col-md-12 mt-5">
            <div className="card ">
              <div className="card-body">
                <h5 className="card-title">Test Questions</h5>

                {/* Course Selector */}
                <div className="mb-4">
                  <select
                    id="courseSelect"
                    className="form-select"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    <option value="">Select Course</option>
                    {questions.length > 0 ? (
                      questions.map((question, index) => (
                        <option key={index} value={question.courseName}>
                          {question.courseName}
                        </option>
                      ))
                    ) : (
                      <option value="">No questions found</option>
                    )}
                  </select>
                </div>

                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <div key={index} className="mb-4">
                      <p className="fw-bold">
                        {index + 1}. {question.question}
                      </p>
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-primary btn-sm text-start">
                          A. {question?.option1}
                        </button>
                        <button className="btn btn-primary btn-sm text-start">
                          B. {question?.option2}
                        </button>
                        <button className="btn btn-primary btn-sm text-start">
                          C. {question?.option3}
                        </button>
                        <button className="btn btn-primary btn-sm text-start">
                          D. {question?.option4}
                        </button>
                      </div>

                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No questions available for the selected course.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizApp;
