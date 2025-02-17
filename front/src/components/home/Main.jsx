import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import styled from "styled-components";
import { customMedia } from "../../GlobalStyles";

import ImageSlider from "./ImageSlider";
import MainClubCard from "./MainClubCard";
import Button from "../common/Button.jsx";
import Spin from "../common/Spin.jsx";

const Main = () => {
  const [sortByCreatedAtClubs, setSortByCreatedAtClubs] = useState([]);
  const [sortByLikesClubs, setsortByLikesClubs] = useState([]);
  const [likedClubs, setLikedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    // fetchData();
    setLoading(false);
  }, [userId]);

  const fetchData = async () => {
    try {
      const createdAtRes = await axios.get("/clubs", {
        params: {
          sortBy: "createdAt",
          tags: "",
          clubStatus: "ACTIVE",
          keyword: "",
          page: 1,
        },
      });
      setSortByCreatedAtClubs(createdAtRes.data.clubList);

      const likesRes = await axios.get("/clubs", {
        params: {
          sortBy: "likes",
          tags: "",
          clubStatus: "ACTIVE",
          keyword: "",
          page: 1,
        },
      });
      setsortByLikesClubs(likesRes.data.clubList);

      if (userId) {
        const likedClubRes = await axios.get("/likedClubs/ids", {
          params: {
            userId: userId,
          },
        });
        setLikedClubs(likedClubRes.data.likedClubIdList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLikedClubs = (clubId) => {
    let index = likedClubs.indexOf(clubId);

    try {
      if (likedClubs.includes(clubId)) {
        likedClubs.splice(index, 1);
        setLikedClubs([...likedClubs]);
        handleLikeDelete(clubId);
      } else {
        setLikedClubs([...likedClubs, clubId]);
        handleLikePost(clubId);
      }
    } catch (err) {
      console.log(err);
    } finally {
      fetchData();
    }
  };

  const handleLikePost = async (clubId) => {
    try {
      await axios.post("/likedClubs", {
        clubId: Number(clubId),
        userId: userId,
      });
    } catch (err) {
      message.error("이미 좋아요한 모임입니다.");
    } finally {
      fetchData();
    }
  };

  const handleLikeDelete = async (clubId) => {
    try {
      axios.delete("/likedClubs", {
        params: { userId: userId, clubId: Number(clubId) },
      });
    } catch (err) {
      console.log(err);
    } finally {
      fetchData();
    }
  };

  return (
    <Wrapper>
      {loading ? (
        <SpinContainer>
          <Spin />
        </SpinContainer>
      ) : (
        <>
          <ImageSlider />
          <Title>마감 임박 순</Title>
          <CardRow>
            {sortByLikesClubs
              .filter((club, i) => i < 8)
              .map((club) => (
                <MainClubCard
                  key={club.id}
                  userId={userId}
                  club={club}
                  handleLikedClubs={handleLikedClubs}
                  likedClubs={likedClubs}
                ></MainClubCard>
              ))}
          </CardRow>
          <ButtonRow>
            <Link to="/board">
              <MainButton>모임 더보기</MainButton>
            </Link>
          </ButtonRow>
        </>
      )}
    </Wrapper>
  );
};

export default Main;

const Wrapper = styled.section`
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 60px;
  flex: 1;

  ${customMedia.lessThan("mobile")`
    width: 295px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    width: 363px;
  `}
	${customMedia.between("largeMobile", "tablet")`
    width: 610px;
  `}
	${customMedia.between("tablet", "desktop")`
    width: 880px;
  `}
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin: 60px 0 40px 0;
  ${customMedia.lessThan("mobile")`
    font-size: 18px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    font-size: 18px;
  `}
	${customMedia.between("largeMobile", "tablet")`
    font-size: 20px;
  `}
	${customMedia.between("tablet", "desktop")`
    font-size: 22px;
    margin: 50px 0 30px 0;
  `}
`;

const CardRow = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;

  ${customMedia.lessThan("mobile")`
    flex-wrap: wrap;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    flex-wrap: wrap;
    gap: 32px;
  `}
  ${customMedia.between("largeMobile", "tablet")`
    flex-wrap: wrap;
    gap: 40px;
  `}
  ${customMedia.between("tablet", "desktop")`
    flex-wrap: wrap;
    gap: 10px;
  `}
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
`;

const MainButton = styled(Button)`
  text-align: center;
  margin: 80px 0;
  border-radius: 30px;
  color: #029400;
  background-color: #ffffff;
  border: 1px solid #029400;
  padding: 10px 20px;
  transition: all 0.3s;

  ${customMedia.lessThan("mobile")`
    font-size: 16px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
  font-size: 16px;
  `}
	${customMedia.between("largeMobile", "tablet")`
    font-size: 14px;
  `}
	${customMedia.between("tablet", "desktop")`
    font-size: 16px;
    margin: 60px 0;
  `}
	&:hover {
    color: #ffffff;
    background-color: #029400;
  }
`;

const SpinContainer = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  ${customMedia.lessThan("mobile")`
    height: 40vh;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    height: 40vh;
  `}
	${customMedia.between("largeMobile", "tablet")`
    height: 40vh;
  `}
`;
