'use client'

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Icon from '@mdi/react';
import { mdiBrightness6, mdiBrightness3 } from '@mdi/js';

import { Suspense } from 'react';

import "bootswatch/dist/lux/bootstrap.min.css";
import '../../components/globals.css'
import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Loading from "../../components/loading";

export default function Home() {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function FetchData() {
    fetch("/api/plants")
    .then((response) => response.json())
    .then((data) => {
      setData(data)
      setIsLoading(false)
    })
  }

  const RenderData = ({data}) => {
    return (
      <Row md="12" className="mt-3 mb-3">
        <table>
          <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Watered</th>
            <th scope="col">Misted</th>
            <th scope="col">Fed</th>
          </tr>
        </thead>
        <tbody>
          {data.map((plant) => (
            <tr>
              <th>{plant.name}</th>
              <td>
                {plant.watered_days_ago == "Unknown" && "No watering data"} 
                {plant.watered_days_ago != "Unknown" && `${plant.watered_days_ago} days ago` } 
              </td>
              <td>
                {plant.misted_days_ago == "Unknown" && "No misting data"} 
                {plant.misted_days_ago != "Unknown" && `${plant.misted_days_ago} days ago` } 
              </td>
              <td>
                {plant.fed_days_ago == "Unknown" && "No feeding data"} 
                {plant.fed_days_ago != "Unknown" && `${plant.fed_days_ago} days ago` } 
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </Row>
    )
  }

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

  function ThemeButton() {

    return (
      // <Button className="themeButton" onClick={() => HandleThemeChange()}>
      //   {theme == "light" && <Icon path={mdiBrightness3} size={1} color={"var(--bs-navbar-brand-color)"} />}
      //   {theme == "dark" && <Icon path={mdiBrightness6} size={1} color={"var(--bs-navbar-brand-color)"} />}
      // </Button>
      <Button className="themeButton" onClick={() => HandleThemeChange()}>
        {/* {theme == "light" && <Icon path={mdiBrightness3} size={1} color={"var(--bs-primary)"} />}
        {theme == "dark" && <Icon path={mdiBrightness6} size={1} color={"var(--bs-secondary)"} />} */}
        {theme == "light" && <Icon path={mdiBrightness3} size={1} color={"var(--bs-secondary)"} />}
        {theme == "dark" && <Icon path={mdiBrightness6} size={1} color={"var(--bs-secondary)"} />}
      </Button>
    );

  }

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const saved = window.localStorage.getItem("theme");
      setTheme(saved || "dark");
    }
    FetchData()
  }, [])

  var environment = process.env.NODE_ENV != "production" ? `(Dev)` : ""

  return (
    <Container className="d-flex flex-column flex-grow-1 px-0 h-100" fluid>
      <Header/>
      <Container className="d-flex flex-column h-100">
        <Suspense fallback={<Loading />}>
          {isLoading && <Loading />}
          <div className="px-2">
          {data && <RenderData data={data} />}
          </div>
        </Suspense>
      </Container >
      <Footer/>
      <div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3">
        <ThemeButton/>
      </div>
    </Container>
  );
}
