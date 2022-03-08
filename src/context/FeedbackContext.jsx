import { createContext, useState, useEffect } from "react";
import axios from "axios";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("feedback?_sort=id&_order=desc");
    setFeedback(res.data);
    setIsLoading(false)
  };

  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });
  // Delete feedback
  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
        await axios.delete(`/feedback/${id}`)
      const remainingData = feedback.filter((item) => item.id !== id);
      setFeedback(remainingData);
    }
  };
  // Add feedback
  const addFeedback = async (newFeedback) => {
    const res = await axios.post("/feedback", newFeedback)
    setFeedback([res.data, ...feedback]);
  };

  // Set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    });
  };

  // Edit feedback
  const updateFeedback = async (id, updItem) => {
      const res = await axios.put(`/feedback/${id}`, updItem)
    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...res.data } : item))
    );
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
