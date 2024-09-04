import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { usePathname } from 'next/navigation'

export default function Header() {

    const pathname = usePathname();

    return (
        <Navbar expand="lg" className="bg-primary z-1 sticky-top" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/summary">Plant notebook</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-none-sm" />
                <Navbar.Collapse id="basic-navbar-nav" className="d-none-sm">
                <Nav className="ms-auto me-0">
                    <Nav.Link className="mt-auto mb-auto" href="/summary" active={pathname=="/summary"}>Summary</Nav.Link>
                    <Nav.Link className="mt-auto mb-auto" href="/add" active={pathname=="/add"}>Add plant</Nav.Link>
                    <Nav.Link className="mt-auto mb-auto" href="/care" active={pathname=="/care"}>Care diary</Nav.Link>
                    {/* <RefreshButton /> */}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}