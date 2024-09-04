import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

export default function Loading() {

    return (
        <Container className="d-flex flex-column h-100 align-items-center justify-content-center">
            <Spinner animation="border" />
        </Container>
    )
}