import React, { useState } from 'react';

/**
 * Simple state-based navigator — no external library needed.
 * Screens register themselves; navigator manages which is visible.
 *
 * Usage:
 *   <AppNavigator initialScreen="Login" screens={{ Login: LoginScreen, Main: MainScreen }} />
 */
export default function AppNavigator({ initialScreen, screens }) {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [params, setParams] = useState({});

  const navigate = (screenName, screenParams = {}) => {
    setParams(screenParams);
    setCurrentScreen(screenName);
  };

  const ScreenComponent = screens[currentScreen];

  if (!ScreenComponent) {
    console.warn(`AppNavigator: screen "${currentScreen}" not found.`);
    return null;
  }

  return <ScreenComponent navigate={navigate} params={params} />;
}
