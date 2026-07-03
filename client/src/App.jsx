import { useEffect, useState } from "react";
import AmbientGlow from "./components/AmbientGlow.jsx";
import PasswordGate from "./components/screens/PasswordGate.jsx";
import Welcome from "./components/screens/Welcome.jsx";
import CurrentIntake from "./components/screens/CurrentIntake.jsx";
import CurrentReveal from "./components/screens/CurrentReveal.jsx";
import AspirationalIntake from "./components/screens/AspirationalIntake.jsx";
import AspirationalReveal from "./components/screens/AspirationalReveal.jsx";
import WhatMattersMost from "./components/screens/WhatMattersMost.jsx";
import {
  getAccessStatus,
  generateCurrentObituary,
  generateAspirationalObituary,
  generateFocus,
} from "./api.js";

const SCREENS = {
  WELCOME: "welcome",
  CURRENT_INTAKE: "current_intake",
  CURRENT_REVEAL: "current_reveal",
  ASPIRATIONAL_INTAKE: "aspirational_intake",
  ASPIRATIONAL_REVEAL: "aspirational_reveal",
  WHAT_MATTERS: "what_matters",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [name, setName] = useState("");
  const [currentAnswers, setCurrentAnswers] = useState(["", "", "", ""]);
  const [aspirationalAnswers, setAspirationalAnswers] = useState(["", "", "", ""]);
  const [currentObituary, setCurrentObituary] = useState("");
  const [aspirationalObituary, setAspirationalObituary] = useState("");
  const [focusLines, setFocusLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [access, setAccess] = useState({
    checked: false,
    required: false,
    unlocked: true,
  });

  // On load, find out whether a private-beta code is required and if we're in.
  useEffect(() => {
    getAccessStatus()
      .then((s) =>
        setAccess({ checked: true, required: s.required, unlocked: s.unlocked }),
      )
      .catch(() =>
        setAccess({ checked: true, required: false, unlocked: true }),
      );
  }, []);

  async function handleCurrentSubmit() {
    setError("");
    setLoading(true);
    try {
      const { obituary } = await generateCurrentObituary({
        name,
        answers: currentAnswers,
      });
      setCurrentObituary(obituary);
      setScreen(SCREENS.CURRENT_REVEAL);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAspirationalSubmit() {
    setError("");
    setLoading(true);
    try {
      const { obituary } = await generateAspirationalObituary({
        name,
        answers: aspirationalAnswers,
      });
      setAspirationalObituary(obituary);

      // The focus lines are a grace note — if they fail, still show the obituary.
      let lines = [];
      try {
        const focus = await generateFocus({
          currentObituary,
          aspirationalObituary: obituary,
        });
        lines = focus.lines || [];
      } catch {
        lines = [];
      }
      setFocusLines(lines);
      setScreen(SCREENS.ASPIRATIONAL_REVEAL);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-full">
      <AmbientGlow />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-12 sm:px-8">
        {!access.checked ? null : access.required && !access.unlocked ? (
          <PasswordGate
            onUnlock={() => setAccess((a) => ({ ...a, unlocked: true }))}
          />
        ) : (
          <>
        {screen === SCREENS.WELCOME && (
          <Welcome onBegin={() => setScreen(SCREENS.CURRENT_INTAKE)} />
        )}

        {screen === SCREENS.CURRENT_INTAKE && (
          <CurrentIntake
            name={name}
            setName={setName}
            answers={currentAnswers}
            setAnswers={setCurrentAnswers}
            loading={loading}
            error={error}
            onSubmit={handleCurrentSubmit}
          />
        )}

        {screen === SCREENS.CURRENT_REVEAL && (
          <CurrentReveal
            obituary={currentObituary}
            onContinue={() => {
              setError("");
              setScreen(SCREENS.ASPIRATIONAL_INTAKE);
            }}
          />
        )}

        {screen === SCREENS.ASPIRATIONAL_INTAKE && (
          <AspirationalIntake
            answers={aspirationalAnswers}
            setAnswers={setAspirationalAnswers}
            loading={loading}
            error={error}
            onSubmit={handleAspirationalSubmit}
          />
        )}

        {screen === SCREENS.ASPIRATIONAL_REVEAL && (
          <AspirationalReveal
            name={name}
            obituary={aspirationalObituary}
            onWhatMatters={() => setScreen(SCREENS.WHAT_MATTERS)}
          />
        )}

        {screen === SCREENS.WHAT_MATTERS && (
          <WhatMattersMost
            focusLines={focusLines}
            onBack={() => setScreen(SCREENS.ASPIRATIONAL_REVEAL)}
          />
        )}
          </>
        )}
      </main>
    </div>
  );
}
