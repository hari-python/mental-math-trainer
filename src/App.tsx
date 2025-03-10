import React, { useState, useEffect, useRef } from 'react';
import { Brain, Check, X, RefreshCw, Timer } from 'lucide-react';

type Operation = '+' | '-' | '*' | '/';

interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
}

interface LevelRequirement {
  minCorrect: number;
  maxMistakes: number;
}

function App() {
  const [level, setLevel] = useState(() => {
    const savedLevel = localStorage.getItem('mathLevel');
    return savedLevel ? parseInt(savedLevel, 10) : 1;
  });
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean | null }>({
    message: '',
    isCorrect: null,
  });
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLevelActive, setIsLevelActive] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const getLevelRequirements = (level: number): LevelRequirement => {
    return {
      minCorrect: 20,
      maxMistakes: Math.max(2, Math.floor(5 - Math.floor((level - 1) / 3))),
    };
  };

  const getTargetRange = (level: number) => {
    return 5 * level;
  };

  const getRandomOperation = (): Operation => {
    const operations: Operation[] = ['+', '-', '*', '/'];
    return operations[Math.floor(Math.random() * operations.length)];
  };

  const generateProblem = (level: number): Problem => {
    const operation = getRandomOperation();
    const targetMax = getTargetRange(level);
    let num1: number;
    let num2: number;
    let answer: number;

    do {
      switch (operation) {
        case '+':
          num1 = Math.floor(Math.random() * (targetMax / 2));
          num2 = Math.floor(Math.random() * (targetMax - num1));
          answer = num1 + num2;
          break;

        case '-':
          answer = Math.floor(Math.random() * targetMax);
          num2 = Math.floor(Math.random() * answer);
          num1 = answer + num2;
          break;

        case '*':
          if (targetMax <= 10) {
            num1 = Math.floor(Math.random() * 5) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
          } else {
            const maxFactor = Math.floor(Math.sqrt(targetMax));
            num1 = Math.floor(Math.random() * maxFactor) + 1;
            num2 = Math.floor(Math.random() * (targetMax / num1)) + 1;
          }
          answer = num1 * num2;
          break;

        case '/':
          num2 = Math.floor(Math.random() * 8) + 2;
          answer = Math.floor(Math.random() * (targetMax / num2)) + 1;
          num1 = answer * num2;
          break;

        default:
          num1 = 0;
          num2 = 0;
          answer = 0;
      }
    } while (
      answer > targetMax ||
      answer < 0 ||
      num1 === 0 ||
      num2 === 0
    );

    return { num1, num2, operation, answer };
  };

  const startLevel = () => {
    setTimeLeft(60);
    setCorrectAnswers(0);
    setMistakes(0);
    setIsLevelActive(true);
    setShowLevelComplete(false);
    setCurrentProblem(generateProblem(level));
    if (inputRef.current) inputRef.current.focus();
  };

  const endLevel = () => {
    setIsLevelActive(false);
    setShowLevelComplete(true);
    const requirements = getLevelRequirements(level);

    if (correctAnswers >= requirements.minCorrect && mistakes <= requirements.maxMistakes) {
      const newLevel = level + 1;
      setLevel(newLevel);
      localStorage.setItem('mathLevel', newLevel.toString());
    } else if (correctAnswers < 10) {
      const newLevel = Math.max(1, level - 1); // Prevent level from going below 1
      setLevel(newLevel);
      localStorage.setItem('mathLevel', newLevel.toString());
    }
  };

  const checkAnswer = () => {
    if (!currentProblem || !isLevelActive) return;

    const numAnswer = parseFloat(userAnswer);
    if (isNaN(numAnswer)) {
      setFeedback({ message: 'Please enter a valid number!', isCorrect: null });
      return;
    }

    const isCorrect = Math.abs(numAnswer - currentProblem.answer) < 0.001;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setUserAnswer('');
      setCurrentProblem(generateProblem(level));
      setFeedback({
        message: 'Correct!',
        isCorrect: true,
      });
    } else {
      setMistakes(prev => prev + 1);
      setUserAnswer('');
      setFeedback({
        message: 'Try again!',
        isCorrect: false,
      });
    }

    setTimeout(() => {
      setFeedback({ message: '', isCorrect: null });
      if (inputRef.current) inputRef.current.focus();
    }, 500);
  };

  useEffect(() => {
    if (isLevelActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endLevel();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLevelActive, timeLeft]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const requirements = getLevelRequirements(level);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-white px-6 py-4 md:px-8 md:py-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-purple-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Mental Math Trainer</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-medium text-gray-600">Level {level}</span>
                {isLevelActive && (
                  <div className="flex items-center text-orange-600">
                    <Timer className="w-5 h-5 mr-1" />
                    <span className="font-bold">{timeLeft}s</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">
            {!isLevelActive && !showLevelComplete && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Level {level}</h2>
                <div className="mb-6 text-left bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold mb-4 text-lg">Level Information:</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      Mixed operations (+ - × ÷)
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      Answers will be between 0 and {getTargetRange(level)}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      Answer {requirements.minCorrect}+ questions in 60 seconds
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      No more than {requirements.maxMistakes} mistakes
                    </p>
                  </div>
                </div>
                <button
                  onClick={startLevel}
                  className="w-full md:w-auto px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 
                    transition-colors text-lg font-medium shadow-lg hover:shadow-xl"
                >
                  Start Level
                </button>
              </div>
            )}

            {isLevelActive && currentProblem && (
              <div className="text-center">
                <div className="flex justify-between items-center mb-6 text-sm font-medium">
                  <span className="text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    Correct: {correctAnswers}
                  </span>
                  <span className="text-red-600 bg-red-50 px-4 py-2 rounded-full">
                    Mistakes: {mistakes}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    ref={inputRef}
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="custom-input"
                    placeholder="Enter your answer"
                  />
                  <button
                    onClick={checkAnswer}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 
                      transition-colors text-lg font-medium shadow-md hover:shadow-lg flex-shrink-0"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {showLevelComplete && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6">
                  {correctAnswers >= requirements.minCorrect && mistakes <= requirements.maxMistakes
                    ? 'Level Complete! 🎉'
                    : 'Level Failed 😢'}
                </h2>
                <div className="space-y-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-600">
                      Questions Answered: 
                      <span className="font-bold text-green-600 ml-2">{correctAnswers}</span>
                      {correctAnswers >= requirements.minCorrect ? 
                        <Check className="inline-block w-5 h-5 ml-2 text-green-600" /> : 
                        <X className="inline-block w-5 h-5 ml-2 text-red-600" />}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-600">
                      Mistakes: 
                      <span className="font-bold text-red-600 ml-2">{mistakes}</span>
                      {mistakes <= requirements.maxMistakes ? 
                        <Check className="inline-block w-5 h-5 ml-2 text-green-600" /> : 
                        <X className="inline-block w-5 h-5 ml-2 text-red-600" />}
                    </p>
                  </div>
                </div>
                <button
                  onClick={startLevel}
                  className="w-full px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 
                    transition-colors text-lg font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  {correctAnswers >= requirements.minCorrect && mistakes <= requirements.maxMistakes
                    ? 'Start Next Level'
                    : 'Retry Level'}
                </button>
              </div>
            )}
          </div>

          {/* Feedback */}
          {feedback.message && (
            <div
              className={`mx-6 md:mx-8 mb-6 flex items-center justify-center p-4 rounded-xl transition-all ${
                feedback.isCorrect === true
                  ? 'bg-green-50 text-green-700'
                  : feedback.isCorrect === false
                  ? 'bg-red-50 text-red-700'
                  : 'bg-yellow-50 text-yellow-700'
              }`}
            >
              {feedback.isCorrect === true && <Check className="w-5 h-5 mr-2" />}
              {feedback.isCorrect === false && <X className="w-5 h-5 mr-2" />}
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
