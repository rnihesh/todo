import React, { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext.jsx";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import writingIcon from "../../assets/writing.svg";
import readIcon from "../../assets/read.svg";
import AlarmIcon from "../../assets/alarm.png";
import { Carousel } from "react-bootstrap";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 300);
console.log("home: ", user)

    setCurrentUser({
      ...currentUser,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.emailAddresses[0].emailAddress,
      profileImageUrl: user?.imageUrl,
    });
    console.log("from home: ",currentUser);

    localStorage.setItem("currentuser", JSON.stringify(currentUser));

    return () => clearTimeout(timeoutId);
  }, [isLoaded]);

  useEffect(() => {
    if (isSignedIn && currentUser?.email) {
      navigate(`author-profile/${currentUser.email}`);
    }
  }, [isSignedIn, currentUser]);

  return (
    <div className="container">
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow spinner-grow-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {isSignedIn === false && (
            <div className="home-item p-5 rounded-3 position-relative overflow-hidden">
            {/* Background Video */}
            <video autoPlay loop muted className="background-video">
              <source src="https://videos.pexels.com/video-files/1851768/1851768-uhd_2560_1440_30fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          
            {/* Content Section */}
            <div className="content-overlay">
              <div className="welcome-section text-center mb-4 blur-card2">
                <h3 className="fs-1">Welcome to TODO ✅</h3>
                <p>Join the community to share your thoughts and ideas.</p>
              </div>
              <Carousel interval={3000} className="info-carousel" indicators={true}>
                <Carousel.Item>
                  <div className="text-center blur-card">
                    <img src={writingIcon} alt="Write Icon" className="info-icon mb-3" />
                    <h5>Create Tasks</h5>
                    <p>Define clear, achievable tasks to stay organized and productive.</p>
                  </div>
                </Carousel.Item>
          
                <Carousel.Item>
                  <div className="text-center blur-card">
                    <img src={readIcon} alt="Read Icon" className="info-icon mb-3" />
                    <h5>Read</h5>
                    <p>Regularly review progress to ensure tasks are completed correctly.</p>
                  </div>
                </Carousel.Item>
          
                <Carousel.Item>
                  <div className="text-center blur-card">
                    <img src={AlarmIcon} alt="Alarm Icon" className="info-icon mb-3" />
                    <h5>Be on Time</h5>
                    <p>Manage deadlines efficiently to maintain consistency and reliability.</p>
                  </div>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
          
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
