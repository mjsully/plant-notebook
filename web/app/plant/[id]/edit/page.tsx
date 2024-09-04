'use client'

import Image from "next/image";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Icon from '@mdi/react';
import Form from 'react-bootstrap/Form'
import { mdiBrightness6, mdiBrightness3, mdiSprinkler, mdiLeaf, mdiNutrition, mdiRefresh } from '@mdi/js';

import { Suspense } from 'react';

import "bootswatch/dist/lux/bootstrap.min.css";
import '../../../../components/globals.css'
import { useEffect, useState } from "react";
import Header from "../../../../components/header"
import Footer from "../../../../components/footer"
import Loading from "../../../../components/loading"

import { useParams, useRouter } from 'next/navigation'

export default function Home() {

  const router = useRouter();

  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState(null);
  const [url, setURL] = useState(null);

  const params = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plantID, setPlantID] = useState(null);

  function FetchData(id) {
    setIsLoading(true)
    fetch(`/api/plant/${id}`)
    .then((response) => response.json())
    .then((data) => {
      setData(data)
      setName(data["name"])
      setLocation(data["location"])
      setNotes(data["notes"])
      setURL(data["url"])
      setIsLoading(false)
      console.log(data)
    })
  }

  function DeletePlant(id) {
    fetch(`/api/plant/${id}`, {
      method: "DELETE",
      body: JSON.stringify({
        id: id
      }),
    }).then(response => {
      console.log(response)
      if (response.ok) {
        router.push("/summary?deletion=true");
      }
    });
  }

  function RenderData() {
    return (
      <Container>
        <Row md="12" className="mt-3 mb-3">
            {/* <img src={data.url}></img> */}
            {/* <p className="h2 mt-3">
              {data.name}
            </p>
            <p>
              {data.notes}
            </p>
            <hr></hr>
              <a> 
                {data.watered_days_ago == "Unknown" && "No watering data"} 
                {data.watered_days_ago != "Unknown" && `Watered ${data.watered_days_ago} days ago` } 
              </a> 
              <a>
                {data.misted_days_ago == "Unknown" && "No misting data"} 
                {data.misted_days_ago != "Unknown" && `Misted ${data.misted_days_ago} days ago` }   
              </a> 
              <a> 
                {data.fed_days_ago == "Unknown" && "No feeding data"} 
                {data.fed_days_ago != "Unknown" && `Fed ${data.fed_days_ago} days ago` } 
              </a> 
            <hr className="mt-3"></hr> */}
            <div className="card mb-3">
              <div className="row g-0">
                <div className="col-md-4">
                  {/* <img src="..." className="img-fluid rounded-start" alt="..."> */}
                  <img src={data.url} className="img-fluid rounded-start"></img>
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{data.name}</h5>
                    <p>
                      {data.notes}
                    </p>
                    <p> 
                      {data.watered_days_ago == "Unknown" && "No watering data"} 
                      {data.watered_days_ago != "Unknown" && `Watered ${data.watered_days_ago} days ago` } 
                    </p> 
                    <p>
                      {data.misted_days_ago == "Unknown" && "No misting data"} 
                      {data.misted_days_ago != "Unknown" && `Misted ${data.misted_days_ago} days ago` }   
                    </p> 
                    <p> 
                      {data.fed_days_ago == "Unknown" && "No feeding data"} 
                      {data.fed_days_ago != "Unknown" && `Fed ${data.fed_days_ago} days ago` } 
                    </p> 
                    <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                  </div>
                </div>
              </div>
            </div>
            <Button className="primary mb-3" href="/summary">
              Back
            </Button>
            <Button className="danger" onClick={() => DeletePlant(data.id)}>
              Delete
            </Button>
          </Row>
      </Container>
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
      <Button className="themeButton me-2" onClick={() => HandleThemeChange()}>
        {theme == "light" && <Icon path={mdiBrightness3} size={1} color={"var(--bs-navbar-brand-color)"} />}
        {theme == "dark" && <Icon path={mdiBrightness6} size={1} color={"var(--bs-navbar-brand-color)"} />}
      </Button>
    );

  }

  function RefreshButton() {

    return (
      <Button className="themeButton me-2" onClick={() => FetchData(params["id"])}>
        <Icon path={mdiRefresh} size={1} color={"var(--bs-navbar-brand-color)"}></Icon>
      </Button>
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

  function HandleForm(event) {
    event.preventDefault()
    console.log("Handling form")
    console.log(event.target.elements.plantName.value)
    console.log(event.target.elements.plantImageURL.value)

    fetch("/api/plant/"+params["id"], {
      method: "PATCH",
      body: JSON.stringify({
        name: name,
        location: location,
        notes: notes,
        url: url
      }),
    }).then(response => {
      console.log(response)
      if (response.ok) {
        router.push("/plant/"+data.id)
      }
    });
  }

  function EditForm() {

    return (
      <div>
        <Form onSubmit={HandleForm}>
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Plant name</Form.Label>
            <Form.Control id="plantName" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          </Form.Group>          
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Plant location</Form.Label>
            <Form.Control id="plantLocation" type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>
          </Form.Group>        
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Plant notes</Form.Label>
            <Form.Control id="plantNotes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mt-3 mb-3">
            <Form.Label>Plant image URL</Form.Label>
            <Form.Control id="plantImageURL" type="text" value={url} onChange={(e) => setURL(e.target.value)}/>
          </Form.Group>
          <Button type="submit" className="w-100 mt-1 mb-1">
            Update
          </Button>
        </Form>
        <Button className="primary mt-1 mb-1 w-100" href={"/plant/"+data.id}>
          Back
        </Button>
        <Button className="danger mt-1 mb-1 w-100" onClick={() => DeletePlant(data.id)}>
          Delete
        </Button>
      </div>
      
    )
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
    FetchData(params["id"])
  }, [])

  var environment = process.env.NODE_ENV != "production" ? `(Dev)` : ""

  return (
    <Container className="d-flex flex-column flex-grow-1 px-0 h-100" fluid>
      <Header/>
      <Container className="d-flex flex-column h-100">

        <Suspense fallback={<Loading/>}>
          {isLoading && <Loading/>}
          <Row>
            <Col md="6">
              {!isLoading && !name && <p className="mt-3 mb-3"> Start filling in data to get a preview of the card </p>}
              {name && <PreviewCard />}
            </Col>
            <Col md="6">
              {data && <EditForm/>}
            </Col>
          </Row>
        </Suspense>

        
      </Container>
      <Footer/>
      <div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3">
        <ThemeButton/>
      </div>
    </Container >
  );
}
