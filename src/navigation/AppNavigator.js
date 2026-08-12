import React, { useState } from 'react';

export default function AppNavigator({ initialScreen, screens }) {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [params, setParams] = useState({});

  const navigate = (screenName, screenParams = {}) => {
    setParams(screenParams);
    setCurrentScreen(screenName);
  };

  const ScreenComponent = screens[currentScreen];

  if (!ScreenComponent) {
    return null;
  }

  return <ScreenComponent navigate={navigate} route={{ params }} />;
}
