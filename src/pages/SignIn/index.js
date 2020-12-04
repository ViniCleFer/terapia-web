import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Input } from "@rocketseat/unform";
import * as Yup from "yup";
import { Heading } from "@chakra-ui/core";

import { signInRequest } from "../../store/modules/auth/actions";

import logo from "../../assets/logoBella.png";

import { Container } from "./styles";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string().required("A Senha é obrigatória"),
});

export default function Signin() {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.auth.loading);

  function handleSubmit({ email, password }) {
    dispatch(signInRequest(email, password));
  }

  return (
    <>
      <img src={logo} alt="grower" />
      <div>
        <Form schema={schema} onSubmit={handleSubmit}>
          <Input name="email" type="email" placeholder="Seu e-mail" />
          <Input name="password" type="password" placeholder="Sua senha" />

          <button type="submit">Entrar</button>
          <Link to="/register">Criar conta gratuita</Link>
        </Form>
      </div>
    </>
  );
}