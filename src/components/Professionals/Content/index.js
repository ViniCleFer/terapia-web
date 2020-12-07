import React, {useState, useEffect, useCallback, useRef} from "react";
import { Grid, Flex, Heading, Button, Textarea, Text, Input } from "@chakra-ui/core";
import { useToasts } from "react-toast-notifications";
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';

import { toast } from "react-toastify";
import NotificationCard from "../../NotificationCallCard";
import {Formik, Form, Field} from 'formik';
import * as yup from 'yup';

import { requestCreateProfile,
  clearDocError,
  setBirthError,
  clearBirthError, } from '../../../store/modules/auth/actions';

import { getSubjectsRequest } from '../../../store/modules/specialty/actions';

import DocHelper from '../../../helpers/docValidate';
import DateHelper from '../../../helpers/dateValidate';

import ChakraInput from "../../ChakraInput";

import { 
  SubjectView,
  SubjectTouchable,
  SubjectText,
 } from './styles';

export function modal() {
  return (
    <Flex>
      <Heading>teste</Heading>
    </Flex>
  );
}

export default function Content() {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);

  const isValidDocReducer = useSelector(state => state.auth.validDoc);
  const isValidEmailRecucer = useSelector(state => state.auth.validEmail);
  // const availableButtons = useSelector(
  //   state => state.commons.availableButtons,
  // );

  const [avatar, setAvatar] = useState('');
  const [doc, setDoc] = useState('');
  const [fmcToken, setFmcToken] = useState('');

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [disabledSubmit, setDisableSubmit] = useState('');
  const [emailReason, setEmailReason] = useState('');
  const [isValidDoc, setIsValidDoc] = useState(true);
  const [address, setAdress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [cep, setCep] = useState('');
  const [graduates, setGraduates] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  
  const [display, setDisplay] = useState(false);

  const subjectsReducer = useSelector((state) => state.specialty.subjects);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState('');

  // const { addToast } = useToasts();

  // function handleModal() {
  //   // addToast("teste", { appearance: "error" });
  //   toast(<NotificationCard />, { autoClose: false, closeOnClick: false });
  // }

  useEffect(() => {
    if (!isValidDocReducer) {
      setDisableSubmit(true);
      setIsValidDoc(false);
    } else {
      setDisableSubmit(false);
      setIsValidDoc(true);
    }
  }, [isValidDocReducer]);

  useEffect(() => {
    if (!isValidEmailRecucer) {
      setDisableSubmit(true);
      setIsValidEmail(false);
      setEmailReason(
        'E-mail já cadastrado em nossa base de dados, efetue seu login',
      );
    } else {
      setDisableSubmit(false);
      setIsValidEmail(true);
    }
  }, [isValidEmailRecucer]);

  useEffect(() => {
    dispatch(getSubjectsRequest());
  }, [dispatch, userId]);

  useEffect(() => {
    setSubjects(subjectsReducer);
  }, [subjectsReducer]);

  async function validateCpf(document) {
    const validDoc = DocHelper.validateDoc(document);
    if (validDoc) {
      return true;
    }
    return false;
  }


  async function validateCep() {
    const testi = cep.replace('-', '');
    const response = await axios.get(`https://viacep.com.br/ws/${testi}/json`);
    setAdress(response.data.logradouro);
    setNeighborhood(response.data.bairro);
    setState(response.data.uf);
    setCity(response.data.localidade);
  }

  const initialValues = {
    doc: "",
    name: "",
    email: "",
    birthDate: "",
    phoneNumber: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    state: "",
    city: "",
    cep: "",
    avatar: "",
    specialties: "",
  };

  const validationSchema = yup.object().shape({
    doc: yup
      .string()
      .required('Preencha o CPF')
      .test('doc', 'Esse CPF está inválido', async (document) => {
        if (document && document.length === 14) {
          const existDoc = await validateCpf(document);

          return existDoc;
        }
      }),
    birthDate: yup
      .string()
      .test('date', 'Essa data está inválida', (date) => {
        if (date) {
          if (DateHelper.isDate(date)) {
            if (DateHelper.limitBornDateMayoritValidation(date)) {
              dispatch(clearBirthError());
              return true;
            }
            dispatch(setBirthError());
            return true;
          }
          return false;
        }
        return true;
      }),
    nome: yup.string().required('Preencha seu nome'),
    email: yup
      .string()
      .email('E-mail inválido')
      .required('Preencha seu E-mail'),
    specialties: yup.string().test('text', 'Essa data está inválida', (text) => {
      if (text) {
        setSearch(text);
        setDisplay(true);
        return true;
      }
      setDisplay(false);
      return true;
    }),
  });

  async function onSubmit(data) {
    dispatch(
      requestCreateProfile({
        name: data.nome,
        doc: data.doc,
        email: data.email,
        birthDate: data.birthDate,
        phoneNumber: data.phoneNumber,
        avatar: data.avatar,
        address,
        number,
        complement,
        neighborhood,
        state,
        city,
        cep,
        fmcToken,
      })
    );

    toast.success("Cadastro Realizado com Sucesso");
    alert("Cadastro Realizado com Sucesso");

    window.location.reload();
    return false;
  }

  function hanldeGraduate(gradItem) {
    setGraduates([...graduates, gradItem]);
  }

  function handleExperience(experItem) {
    setExperiences([...experiences, experItem]);
  }

  function handleSpecialty(specialItem) {
    setSpecialties([...specialties, specialItem]);
  }

  const setProfi = (sub) => {
    setSearch(sub.description);
    setDisplay(false);
    setSearch('');
    handleSpecialty(sub)
  };

  const handleCancelSpecialty = (especialtyId) => {
    setSpecialties(specialties.filter(special => special.id !== especialtyId));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={false}>
      {({ values, handleChange, handleBlur, handleSubmit, errors, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Grid
            templateColumns="1fr 1fr 1fr "
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
              <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                Nome
              </Heading>
              <ChakraInput
                name="name"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                type="text"
                placeholder="Nome Completo"
                errorBorderColor="crimson"
                width="400px"
              />
            </Flex>
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              E-mail
            </Heading>

            <ChakraInput
              name="email"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              type="text"
              placeholder="E-mail"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
             CPF
            </Heading>

            <ChakraInput
              name="doc"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.doc}
              type="text"
              placeholder="555.555.555-55"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Data de nascimento
            </Heading>

            <ChakraInput
              name="birthDate"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.birthDate}
              type="date"
              placeholder="11/11/1111"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Telefone
            </Heading>

            <ChakraInput
              name="phone"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.phone}
              type="phone"
              placeholder="DD-XXXXX-XXXX"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Avatar
            </Heading>

            <ChakraInput
              name="avatar"
              align="center"
              padding="6px"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.avatar}
              type="file"
              accept="image/*"
              placeholder="DD-XXXXX-XXXX"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          </Grid>
          {/* <Flex  
            backgroundColor="#f1f0ef"
            direction="column" align="flex-start" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="600" size="md"padding="5px" mb="-15px">
              Endereço
            </Heading>
          </Flex>
          <Flex 
            backgroundColor="#f1f0ef"
            direction="column" align="flex-start"  padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                CEP
              </Heading>

              <ChakraInput
                name="cep"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cep}
                type="text"
                placeholder="11111-111"
                errorBorderColor="crimson"
                width="400px"
              />
          </Flex>
          <Grid
            templateColumns="1fr 1fr 1fr "
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
              <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                Rua
              </Heading>

              <ChakraInput
                name="address"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                type="text"
                placeholder="Rua, Avendida, etc..."
                errorBorderColor="crimson"
                width="400px"
              />
            </Flex>
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Número
            </Heading>

            <ChakraInput
              name="number"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.number}
              type="text"
              placeholder="Número"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
             Complemento
            </Heading>

            <ChakraInput
              name="complement"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.complement}
              type="text"
              placeholder="Casa, apartamento, etc..."
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          </Grid>
          <Grid
            templateColumns="1fr 1fr 1fr "
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
              <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                Bairro
              </Heading>

              <ChakraInput
                name="neighborhood"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.neighborhood}
                type="text"
                placeholder="Bairro"
                errorBorderColor="crimson"
                width="400px"
              />
            </Flex>
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Cidade
            </Heading>

            <ChakraInput
              name="city"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.city}
              type="text"
              placeholder="Cidade"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
             Estado
            </Heading>

            <ChakraInput
              name="state"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.state}
              type="text"
              placeholder="Ex: SP"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          </Grid> */}
          <Flex  
            backgroundColor="#f1f0ef"
            direction="column" align="flex-start" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="600" size="md"padding="5px" mb="-15px">
              Informações Profissionais
            </Heading>
          </Flex>
          <Grid
            templateColumns="1fr"
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            <Flex direction="column" align="flex-start" width="1410px" padding="10px">
              <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                Sobre
              </Heading>

              <Textarea
                name="about"
                id="about"
                value={values.about}
                onChange={handleChange}
                placeholder="Sobre o profissional"
                size="sm"
                height="50px"
                mt="20px"
              />
            </Flex>
          </Grid>
          <Grid
            templateColumns="1fr 1fr 1fr "
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
              <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                Tipo de documento
              </Heading>

              <ChakraInput
                name="docDescription"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.docDescription}
                type="text"
                placeholder="CRP"
                errorBorderColor="crimson"
                width="400px"
              />
            </Flex>
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Número do documento
            </Heading>

            <ChakraInput
              name="docValue"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.docValue}
              type="text"
              placeholder="1234/6"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
             Valor por consulta
            </Heading>

            <ChakraInput
              name="value"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.value}
              type="text"
              placeholder="R$ 150,00"
              errorBorderColor="crimson"
              width="400px"
            />
          </Flex>
          </Grid>
          <Grid
            templateColumns="1fr 1fr"
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            <Flex direction="column" align="flex-start" width="650px" padding="10px">
              <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                Link da página pessoal
              </Heading>

              <ChakraInput
                name="pageUrl"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pageUrl}
                type="text"
                placeholder="https://www.linkedin.com/"
                errorBorderColor="crimson"
                width="650px"
              />
            </Flex>
            <Flex direction="column" align="flex-start" width="650px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
            Link do vídeo de apresentação
            </Heading>

            <ChakraInput
              name="videoUrl"
              align="center"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.videoUrl}
              type="text"
              placeholder="https://www.youtube.com/"
              errorBorderColor="crimson"
              width="650px"
            />
          </Flex>
          </Grid>
          <Grid
            templateColumns="1fr 1fr"
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            <Flex direction="column" align="flex-start" width="600px" padding="10px">
              <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                Graduação ou curso
              </Heading>

              <Flex direction="row">
                <ChakraInput
                  name="college"
                  align="center"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.college}
                  type="text"
                  placeholder="Faculdade Federal de SP"
                  errorBorderColor="crimson"
                  width="600px"
                />
                <Button onClick={() => hanldeGraduate(values.college)} background="#6E8BC6" variant="solid" color="#fff" mt="15px" ml="10px">
                  + 
                </Button>
              </Flex>

              <Flex direction="column" p="5px">
                {graduates.map(graduate => (
                  <Flex direction="row" p="5px" align="center">
                    <Text>{graduate}</Text>
                    <Button height="15px" width="0px" onClick={() => {}} background="#6E8BC6" variant="solid" color="#fff" mt="2px" ml="10px">
                      x
                    </Button>
                  </Flex>
                ))}
              </Flex>

            </Flex>
            <Flex direction="column" align="flex-start" width="600px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
            Experiências profissionais
            </Heading>

            <Flex direction="row">
              <ChakraInput
                name="especialty"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.especialty}
                type="text"
                placeholder="5 anos de experiência na área organizacional"
                errorBorderColor="crimson"
                width="600px"
              />
              <Button onClick={() => handleExperience(values.especialty)} background="#6E8BC6" variant="solid" color="#fff" mt="15px" ml="10px">
                + 
              </Button>
            </Flex>

            <Flex direction="column" p="5px">
              {experiences.map(experience => (
                <Flex direction="row" p="5px" align="center">
                  <Text>{experience}</Text>
                  <Button height="15px" width="0px" onClick={() => {}} background="#6E8BC6" variant="solid" color="#fff" mt="2px" ml="10px">
                    x
                  </Button>
                </Flex>
              ))}
            </Flex>
          </Flex>
          </Grid>
          <Grid
            templateColumns="1fr"
            // gridAutoRows="150px"
            gap={3}
            backgroundColor="#f1f0ef"
          >
            <Flex direction="column" align="flex-start" width="650px" padding="10px">
              <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
                Especialidades
              </Heading>

              <ChakraInput
                name="specialties"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.specialties}
                type="text"
                placeholder="Ansiedade"
                errorBorderColor="crimson"
                width="650px"
              />
            </Flex>

            {display && (
              <SubjectView>
                {subjects
                  .filter(
                    ({description}) =>
                      description
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .includes(search) ||
                      description
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase()
                        .includes(search),
                  )
                  .map((val) => (
                    <SubjectTouchable
                      key={val.id}
                      onClick={() => setProfi(val)}>
                      <SubjectText>{val.description}</SubjectText>
                    </SubjectTouchable>
                  ))}
              </SubjectView>
            )}

            <Flex direction="row" pl="15px" mt="-5px">
              {specialties.map(specialty => (
                <Flex direction="row" p="5px" align="center" border="1px" borderColor="gray.400" borderRadius="4px" mr="5px" >
                  <Text>{specialty.description}</Text>
                  <Button height="15px" width="0px" onClick={() => handleCancelSpecialty(specialty.id)} background="#6E8BC6" variant="solid" color="#fff" mt="2px" ml="10px">
                    x
                  </Button>
                </Flex>
              ))}
            </Flex>
          
          </Grid>
          <Flex backgroundColor="#f1f0ef" justifyContent="center" pb="15px">
            <Button
              width="400px"
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Flex>
          
        </Form>
      )}
    </Formik>
    
  );
}



// avatar1,
// name,
// doc,
// email,
// healthCardNumber,
// birthdateValid,
// phoneNumber,
// address,
// number,
// complement,
// neighborhood,
// state,
// city,
// cep,
// values.password,
// fmcToken,

// {
//   "description": "Description",
//   "docValue": "1234/6",
//   "docDescription": "CRP",
//   "value": 50,
//   "videoUrl": "https://google.com",
//   "profileId": 831,
//   "graduates": [
//       {
//           "college": "Faculdade federal"
//       },
//       {
//           "college": "Faculdade de estadual"
//       }
//   ],
//   "experiences": [
//       {
//           "especialty": "Manjo de X"
//       },
//       {
//           "especialty": "Manjo de Y"
//       },
//       {
//           "especialty": "Manjo de Z"
//       }
//   ],
//   "specialties": [
//       {
//           "id": 1
//       },
//       {
//           "id": 2
//       },
//       {
//           "id": 3
//       },
//       {
//           "id": 4
//       }
//   ]
// }