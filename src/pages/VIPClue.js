import React, { useState } from "react";

import { Button, Col, Container, Form, Row } from "react-bootstrap";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { VIPClueTextFour, VIPClueTextOne, VIPClueTextThree, VIPClueTextTwo } from "../assets/prompts/VIPClue";


const VIPClue = ({ localConfig, changeStage, changeLocalConfig }) => {
  if (localConfig["localStage"] === "decrypt") {
    return ( <DecryptBase changeLocalConfig={ changeLocalConfig }
                          changeStage={ changeStage }
                          localConfig={ localConfig } /> )
  } else {
    if (localConfig["localReadingStage"] === "guessed") {
      return ( <VIPClueTextFour changeStage={ changeStage } /> )
    } else if (localConfig["localReadingStage"] === "three") {
      return ( <VIPClueTextThree changeLocalConfig={ changeLocalConfig }
                                 hasReadEverything={ localConfig["hasReadEverything"] } /> )
    } else if (localConfig["localReadingStage"] === "two") {
      return ( <VIPClueTextTwo changeLocalConfig={ changeLocalConfig }
                               hasReadEverything={ localConfig["hasReadEverything"] } /> )
    } else {
      return ( <VIPClueTextOne changeLocalConfig={ changeLocalConfig }
                               hasReadEverything={ localConfig["hasReadEverything"] } /> )
    }
  }
};


const DecryptBase = ({ localConfig, changeLocalConfig }) => (
  <>
    <Header />

    <Container style={ { minHeight: "50vh" } }>
      <h1>Decryption Task</h1>
      <h3 style={ { textIndent: "10%", paddingTop: "5%" } }>
        The previous episode includes clues that will lead you to discover who the targeted VIP is, to find the
        answer, you will be guided through three different steps.
      </h3>
      <DecryptForm changeLocalConfig={ changeLocalConfig }
                   localConfig={ localConfig } />
    </Container>
    <Container>
      <p><em><strong>HINT:</strong> Read the Text carefully, you may use Google to your advantage.</em></p>
    </Container>

    <Footer />
  </>
);

const DecryptForm = ({ changeLocalConfig, localConfig }) => {
  const [ answer, setAnswer ] = useState("");
  const [ error, setError ] = useState(false);
  const [ success, setSuccess ] = useState(false);

  const checkAnswer = (event) => {
    event.preventDefault();
    setError(false);
    setSuccess(false);

    const stageParams = {
      index: localConfig["localEncryptStage"] === "three" ? 2 : ( localConfig["localEncryptStage"] === "two" ? 1 : 0 ),
      nextStage: localConfig["localEncryptStage"] === "three" ?
                 "SKIP" :
                 ( localConfig["localEncryptStage"] === "two" ? "three" : "two" ),
    };

    if (answer.toUpperCase() === localConfig["answers"][stageParams["index"]].toUpperCase()) {
      setAnswer("");
      setSuccess(true);
      if (stageParams["nextStage"] === "SKIP") {
        changeLocalConfig("localReadingStage", "guessed")
        changeLocalConfig("localStage", "reading")
      } else {
        changeLocalConfig("localEncryptStage", stageParams["nextStage"])
      }
    } else {
      setError(true);
    }
  }

  return (
    <Container style={ { paddingTop: "5%", paddingBottom: "5%", textAlign: "center" } }>

      { error && <h5> Incorrect answer! </h5> }
      { success && <h5> Good Job! Onto the next one. </h5> }

      <Form onSubmit={ checkAnswer }>
        <Row>
          <Col>
            { localConfig["localEncryptStage"] === "one" &&
              <h5 style={ { paddingBottom: "5%" } }>What was that small Object?</h5> }
            { localConfig["localEncryptStage"] === "two" &&
              <h5 style={ { paddingBottom: "5%" } }>What is the Cipher Key?</h5> }
            { localConfig["localEncryptStage"] === "three" &&
              <h5 style={ { paddingBottom: "5%" } }>Who is the Target VIP?</h5> }
          </Col>
          <Col sm={ 8 }>
            <Form.Group style={ { paddingBottom: "3%" } }
                        className="mb-3"
                        controlId="formBasicAnswer">
              <Form.Control type="text"
                            placeholder="Answer..."
                            defaultValue={ answer }
                            onChange={ (event) => setAnswer(event.target.value) } />
            </Form.Group>
          </Col>
        </Row>
        <Row style={ { paddingTop: "5%", paddingBottom: "5%" } }>
          <Col>
            <Button variant="danger"
                    type="submit">
              <h3>Check Answer</h3>
            </Button>
          </Col>
          <Col>
            <Button variant="danger"
                    onClick={ () => changeLocalConfig("localStage", "reading") }>
              <h3>Go Back to Text</h3>
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default VIPClue;