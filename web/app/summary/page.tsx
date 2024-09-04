'use client'

import Image from "next/image";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import Icon from '@mdi/react';
import { mdiBrightness6, mdiBrightness3, mdiSprinkler, mdiLeaf, mdiNutrition, mdiRefresh } from '@mdi/js';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import "bootswatch/dist/lux/bootstrap.min.css";
// import './globals.css'
import '../../components/globals.css'
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Loading from "../../components/loading";

export default function Home() {

  const router = useRouter();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toggleToast = () => setShowToast(!showToast);

  const params = useSearchParams();

  function FetchData() {
    setIsLoading(true)
    fetch("/api/plants")
    .then((response) => response.json())
    .then((data) => {
      setData(data)
      setIsLoading(false)
    })
  }

  function PostCareData(id, type) {
    let res = fetch(`/api/plant/${id}/care`, {
      method: "POST",
      body: JSON.stringify({
        id: id,
        type: type
      }),
    });
    FetchData();
  }

  function MessageToast(message, level) {

    return (
      <Toast show={showToast} onClose={toggleToast}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
    )

  }

  const RenderData = ({data}) => {

    return (
      <Row md="2" lg="3">
        {data.map((plant) => (
          <Container key={plant.id}>
          <Card className="mt-3 mb-3">
            <a href={"/plant/"+plant.id}>
              <Card.Img src={plant.url}></Card.Img>
            </a>
            <Card.Body>
              <Card.Title> {plant.name} </Card.Title>
              <p className="text-truncate">
                {plant.notes}
              </p>
              <p>
                <b>
                  Added on {plant.added}
                </b>
              </p>
              <hr></hr>
              <Button className="care-button" onClick={() => {PostCareData(plant.id, "water")}}>
                <Icon path={mdiLeaf} size={1.5} color="green" />
              </Button>
              <a> 
                {plant.watered_days_ago == "Unknown" && "No watering data"} 
                {plant.watered_days_ago != "Unknown" && `Watered ${plant.watered_days_ago} days ago` } 
              </a> 
              <br></br>
              <Button className="care-button" onClick={() => {PostCareData(plant.id, "mist")}}>
                <Icon path={mdiSprinkler} size={1.5} color="blue" />
              </Button>
              <a>
                {plant.misted_days_ago == "Unknown" && "No misting data"} 
                {plant.misted_days_ago != "Unknown" && `Misted ${plant.misted_days_ago} days ago` }   
              </a> 
              <br></br>
              <Button className="care-button" onClick={() => {PostCareData(plant.id, "food")}}>
                <Icon path={mdiNutrition} size={1.5} color="orange" />
              </Button>
              <a> 
                {plant.fed_days_ago == "Unknown" && "No feeding data"} 
                {plant.fed_days_ago != "Unknown" && `Fed ${plant.fed_days_ago} days ago` } 
              </a> 
            </Card.Body>
            <Card.Footer>
                {plant.location}
            </Card.Footer>
        </Card>
          </Container>
        ))}
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

  function RefreshButton() {

    return (
      <Button className="themeButton me-2" onClick={() => FetchData()}>
        <Icon path={mdiRefresh} size={1} color={"var(--bs-navbar-brand-color)"}></Icon>
      </Button>
    );

  }

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {

  }, [isLoading])

  useEffect(() => {
    if (typeof window !== undefined) {
      const saved = window.localStorage.getItem("theme");
      setTheme(saved || "dark");
    }
    console.log(params);
    if (params.get("success") == "true") {
      router.replace("/summary");
      setToastMessage("Successfully added your plant!")
      setShowToast(true);
    }
    if (params.get("deletion") == "true") {
      router.replace("/summary");
      setToastMessage("Successfully deleted your plant!")
      setShowToast(true);
    }
    FetchData()
  }, [])

  var environment = process.env.NODE_ENV != "production" ? `(Dev)` : ""

  return (
    <Container className="d-flex flex-column flex-grow-1 px-0 h-100" fluid>
      <Header/>
      <Container className="d-flex flex-column h-100 mt-3">

        <Suspense fallback={<Loading />}>
          {isLoading && <Loading />}
          {data && <RenderData data={data} />}
        </Suspense>

      </Container>
      <MessageToast/>
      <Footer/>
      <div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3">
        <ThemeButton/>
      </div>
    </Container >
  );
}
