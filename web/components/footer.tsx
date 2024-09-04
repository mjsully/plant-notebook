import Container from "react-bootstrap/Container"

export default function Footer() {

  var environment = process.env.NODE_ENV != "production" ? " - " + process.env.NODE_ENV : ""

    return (
        <Container>
            <footer className="py-3 my-4 mt-auto">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                </ul>
                <p className="text-center text-body-secondary"> Built using Next.js and Bootstrap {environment} </p>
            </footer>
        </Container>
    )
}