import React from "react";
import JokeList from "./JokeList";
import "./App.css";

/** App component. Renders list of jokes. */

const App = () => {
  return (
    <div className="App">
      <h1>Welcome To Cheezy Jokes 😁</h1>
      <JokeList />
    </div>
  );
};

export default App;
