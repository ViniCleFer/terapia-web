import styled from "styled-components";
import { darken } from "polished";

export const Wrapper = styled.div`
  height: 100%;
  background: #fff;
  display: flex;
  margin-top: -75px;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  height: 60%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 315px;
  text-align: center;
  justify-content: center;
  align-items: center;
  img {
    /* display: flex; */
    margin-left: 105px;
  }
  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    input {
      background: #fff;
      border: 1px solid #801857;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: black;
      margin: 0 0 10px;
      &::placeholder {
        color: black;
      }
    }
    span {
      color: #fb6f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }
    button {
      margin: 5px 0 0;
      height: 44px;
      background: #a92765;
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      transition: background 0.2s;
      &:hover {
        background: ${darken(0.03, "#801857")};
      }
    }
    a {
      color: #fff;
      margin-top: 15px;
      font-size: 16px;
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }
`;
