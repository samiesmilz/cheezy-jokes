import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ numJokesToGet = 5 }) => {
  const getSavedJokes = () => {
    const localJokes = JSON.parse(window.localStorage.getItem("jokes"));
    return localJokes || [];
  };

  const [jokes, setJokes] = useState(getSavedJokes);
  const [isLoading, setIsLoading] = useState(true);

  /* retrieve jokes from API */
  useEffect(() => {
    async function getJokes() {
      try {
        // load jokes one at a time, adding not-yet-seen jokes
        let seenJokes = new Set();
        while (jokes.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" },
          });
          let { ...joke } = res.data;

          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jokes.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }
        window.localStorage.setItem("jokes", JSON.stringify(jokes));
        setJokes(jokes);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    getJokes();
  }, [jokes, numJokesToGet]);

  /* empty joke list, set to loading state, and then call getJokes */
  const generateNewJokes = () => {
    setIsLoading(true);
    setJokes([]); // not complete
  };

  /* change vote for this id by delta (+1 or -1) */

  const vote = (id, delta) => {
    setJokes(
      jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  const clearVotes = () => {
    setJokes(jokes.map((j) => ({ ...j, votes: 0 })));
    window.localStorage.removeItem("jokes");
  };

  /* render: either loading spinner or list of sorted jokes. */
  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>
      <button onClick={clearVotes} className="JokeList-clear ">
        Clear votes
      </button>
      <div className="JokeList-jokes">
        {sortedJokes.map((j) => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={vote}
          />
        ))}
      </div>
    </div>
  );
};

export default JokeList;
