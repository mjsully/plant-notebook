'use client'

import Container from "react-bootstrap/Container"
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import { useRouter } from 'next/navigation';

import Icon from '@mdi/react';
import { mdiBrightness6, mdiBrightness3 } from '@mdi/js';

import "bootswatch/dist/lux/bootstrap.min.css";
import '../../components/globals.css'
import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer"

export default function Home() {

  const router = useRouter();

  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState(null);
  const [url, setURL] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toggleToast = () => setShowToast(!showToast);

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
      <Button className="themeButton" onClick={() => HandleThemeChange()}>
        {theme == "light" && <Icon path={mdiBrightness3} size={1} color={"var(--bs-navbar-brand-color)"} />}
        {theme == "dark" && <Icon path={mdiBrightness6} size={1} color={"var(--bs-navbar-brand-color)"} />}
      </Button>
    );

  }

  function HandleForm(event) {
    event.preventDefault()
    console.log("Handling form")
    console.log(event.target.elements.plantName.value)
    console.log(event.target.elements.plantImageURL.value)

    fetch("/api/plants", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        location: location,
        notes: notes,
        url: url
      }),
    }).then(response => {
      console.log(response)
      if (response.ok) {
        router.push("/summary?success=true");
      }
      else {
        setToastMessage("Something went wrong. Please check details and try again!");
        setShowToast(true);
      }
    }
    );

  }

  function PreviewCard() {
    return (
      <Card className="mt-3 mb-3">
        <Card.Img src={url}></Card.Img>
        <Card.Body>
          <Card.Title> {name} </Card.Title>
          <p>
            {notes}
          </p>
        </Card.Body>
        <Card.Footer>
            {location}
        </Card.Footer>
    </Card>
    )
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

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {

  }, [
    name,
    location
  ])

  useEffect(() => {    
    if (typeof window !== undefined) {
      const saved = window.localStorage.getItem("theme");
      setTheme(saved || "dark");
    }
  }, [])

  var environment = process.env.NODE_ENV != "production" ? `(Dev)` : ""

  return (
    <Container className="d-flex flex-column flex-grow-1 px-0 h-100" fluid>
      <Header/>
      <Container className="d-flex flex-column h-100">

        {!name && <p className="mt-3 mb-3"> Start filling in data to get a preview of the card </p>}
        {name && <PreviewCard />}

        <Form onSubmit={HandleForm}>
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Plant name</Form.Label>
            <Form.Control id="plantName" type="text" placeholder="Enter the plant name/species" onChange={(e) => setName(e.target.value)}/>
          </Form.Group>          
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Plant location</Form.Label>
            <Form.Control id="plantLocation" type="text" placeholder="Enter a location for the plant (e.g. living room)" onChange={(e) => setLocation(e.target.value)}/>
          </Form.Group>        
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Plant notes</Form.Label>
            <Form.Control id="plantNotes" type="text" placeholder="Enter any notes for the plant" onChange={(e) => setNotes(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Plant image URL</Form.Label>
            <Form.Control id="plantImageURL" type="text" placeholder="Enter a URL containing an image of the plant" onChange={(e) => setURL(e.target.value)}/>
          </Form.Group>
          <Button type="submit">
            Submit
          </Button>
        </Form>
      </Container>
      <Footer/>
      <MessageToast/>
      <div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3">
        <ThemeButton/>
      </div>
    </Container >
  );
}
