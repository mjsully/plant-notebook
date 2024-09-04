import Button from "react-bootstrap/Button";
import Icon from '@mdi/react';
import { mdiBrightness6, mdiBrightness3, mdiSprinkler, mdiLeaf, mdiNutrition, mdiRefresh } from '@mdi/js';

import { useState } from "react";

export default function ThemeButton() {

  const [theme, setTheme] = useState("dark");

  function HandleThemeChange() {
    console.log("Handling theme change");
    if (theme == "dark" && typeof window !== undefined) {
      window.localStorage.setItem('theme', 'light');
      setTheme("light")
    }
    else {
      window.localStorage.setItem('theme', 'dark');
      setTheme("dark")
    }
  }

  return (
    <Button className="themeButton" onClick={() => HandleThemeChange()}>
      {/* {theme == "light" && <Icon path={mdiBrightness3} size={1} color={"var(--bs-secondary)"} />}
      {theme == "dark" && <Icon path={mdiBrightness6} size={1} color={"var(--bs-secondary)"} />} */}
      <Icon path={mdiBrightness6} size={1} color={"var(--bs-secondary)"}/>
    </Button>
  );

}