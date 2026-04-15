import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CountUp from "react-countup";
import ReactVisibilitySensor from "react-visibility-sensor";
import axiosClient from "../../axios/axios-client";

export default function Summary() {
  const [data, setData] = useState({
    universityCount: 0,
    studentCount: 0,
    scholarshipCallCount: 0,
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [universityRes, studentRes, callRes] = await Promise.allSettled([
          axiosClient.get("universityCount?limit=1"),
          axiosClient.get("studentsCount?limit=1"),
          axiosClient.get("scholarshipCallCount?limit=1"),
        ]);

        setData({
          universityCount:
            universityRes.status === "fulfilled"
              ? universityRes.value?.data?.universities_count ?? 0
              : 0,
          studentCount:
            studentRes.status === "fulfilled"
              ? studentRes.value?.data?.students_count ?? 0
              : 0,
          scholarshipCallCount:
            callRes.status === "fulfilled"
              ? callRes.value?.data?.open_scholarship_calls_count ?? 0
              : 0,
        });
      } catch (err) {
        setError(true);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <Container fluid={true} className="summaryBanner">
        <div className="summaryBannerOverlay d-flex align-items-center">
          <Row className="d-flex w-100 justify-content-evenly">
            <Col lg={4} md={4} sm={12} className="text-center">
              <h1 className="countNumber title">
                <CountUp start={0} end={data.universityCount}>
                  {({ countUpRef, start }) => (
                    <ReactVisibilitySensor onChange={start} delayedCall>
                      <span ref={countUpRef} />
                    </ReactVisibilitySensor>
                  )}
                </CountUp>
              </h1>
              <h4 className="title">Broj univerziteta</h4>
              <hr className="bg-white w-30"></hr>
            </Col>
            <Col lg={4} md={4} sm={12} className="text-center">
              <h1 className="countNumber title">
                <CountUp start={0} end={data.studentCount}>
                  {({ countUpRef, start }) => (
                    <ReactVisibilitySensor onChange={start} delayedCall>
                      <span ref={countUpRef} />
                    </ReactVisibilitySensor>
                  )}
                </CountUp>
              </h1>
              <h4 className="title">Broj studenata</h4>
              <hr className="bg-white w-30"></hr>
            </Col>
            <Col lg={4} md={4} sm={12} className="text-center">
              <h1 className="countNumber title">
                <CountUp start={0} end={data.scholarshipCallCount}>
                  {({ countUpRef, start }) => (
                    <ReactVisibilitySensor onChange={start} delayedCall>
                      <span ref={countUpRef} />
                    </ReactVisibilitySensor>
                  )}
                </CountUp>
              </h1>
              <h4 className="title">Broj otvorenih konkursa</h4>
              <hr className="bg-white w-30"></hr>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
}
