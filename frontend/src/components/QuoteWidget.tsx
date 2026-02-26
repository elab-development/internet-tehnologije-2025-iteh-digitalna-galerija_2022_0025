import React, { useEffect, useState } from "react";
import './QuoteWidget.css';

const QuoteWidget: React.FC = () => {
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then(res => res.json())
      .then(data => {
        setAdvice(data.slip.advice);
      });
  }, []);

  return (
    <div className="quote-widget">
      <div className="quote-bubble">
        {advice ? (
          <span className="quote-text">{advice}</span>
        ) : (
          <span className="quote-text" style={{color:'#bbb'}}>Loading advice...</span>
        )}
      </div>
    </div>
  );
};

export default QuoteWidget;
