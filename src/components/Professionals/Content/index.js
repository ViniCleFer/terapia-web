/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react";
import { Grid, Flex, Heading, Button, Text, Input, Textarea, FormControl, FormErrorMessage} from "@chakra-ui/core";
// import { useToasts } from "react-toast-notifications";
import {useSelector, useDispatch} from 'react-redux';
// import axios from 'axios';
import { mask } from 'remask'
// import { toast } from "react-toastify";
// import NotificationCard from "../../NotificationCallCard";
// import {Formik, Form, Field} from 'formik';
// import * as yup from 'yup';
// import {v4 as uuid} from 'uuid';

import { requestCreateProfile,
  clearDocError,
  setBirthError,
  clearEmailError,
  clearPhoneError,
  clearBirthError,
  cancelLoading,
  // docError,
} from '../../../store/modules/auth/actions';

import { getSubjectsRequest } from '../../../store/modules/specialty/actions';

import DocHelper from '../../../helpers/docValidate';
import DateHelper from '../../../helpers/dateValidate';

import theme from '../../../styles/theme';

// import ChakraInput from "../../ChakraInput";
// import ChakraTextarea from "../../ChakraTextarea";

import { 
  SubjectView,
  SubjectTouchable,
  SubjectText,
  // TextAlert,
 } from './styles';
// import { availableButtons } from "../../../store/modules/commons/actions";

// export function modal() {
//   return (
//     <Flex>
//       <Heading>teste</Heading>
//     </Flex>
//   );
// }

export default function Content() {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.userId);

  const phoneError = useSelector(state => state.auth.phoneError);
  const emailError = useSelector(state => state.auth.emailError);
  const validDoc = useSelector(state => state.auth.validDoc);
  const birthError = useSelector(state => state.auth.birthError);
  const loading = useSelector(state => state.auth.loading);
  // const isValidEmailRecucer = useSelector(state => state.auth.validEmail);
  // const availableButtons = useSelector(
  //   state => state.commons.availableButtons,
  // );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [doc, setDoc] = useState('');
  const [birthDate, setBirthDate] = useState({});
  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState('');
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [docValue, setDocValue] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [value, setValue] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [college, setCollege] = useState('');
  const [specialty, setSpecialty] = useState('');

  // const [fmcToken, setFmcToken] = useState('');

  // const [isValidEmail, setIsValidEmail] = useState(true);
  const [disabledSubmit, setDisableSubmit] = useState(false);
  // const [emailReason, setEmailReason] = useState('');
  // const [isValidDoc, setIsValidDoc] = useState(true);
  // const [address, setAdress] = useState('');
  // const [number, setNumber] = useState('');
  // const [complement, setComplement] = useState('');
  // const [neighborhood, setNeighborhood] = useState('');
  // const [state, setState] = useState('');
  // const [city, setCity] = useState('');
  // const [cep, setCep] = useState('');
  const [graduates, setGraduates] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const [newGraduates, setNewGraduates] = useState();
  const [newExperiences, setNewExperiences] = useState();
  const [newSpecialties, setNewSpecialties] = useState();

  
  const [display, setDisplay] = useState(false);

  const subjectsReducer = useSelector((state) => state.specialty.subjects);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState('');

  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorDoc, setErrorDoc] = useState(false);
  const [errorBirth, setErrorBirth] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorDocValue, setErrorDocValue] = useState(false);
  const [errorDocDescription, setErrorDocDescription] = useState(false);
  const [errorValue, setErrorValue] = useState(false);
  const [errorCollege, setErrorCollege] = useState(false);
  const [errorSpecialty, setErrorSpecialty] = useState(false);
  const [errorEspecialties, setErrorEspecialties] = useState(false);

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

  function onSubmit() {
    handleNameError();
    handleEmailError();
    handleDocError();
    handleBirthError();
    handlePhoneError();
    handleDescriptionError();
    handleDocDescriptionError();
    handleDocValueError();
    handleValueError();
    handleCollegeError();
    handleSpecialtyError();
    handleEspecialtiesError();

    console.log('clicou função OnSunmit', {
    name,
    doc,
    email,
    birthDate,
    phoneNumber: phoneValid,
    avatar,
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    state: '',
    city: '',
    cep: '',
    description,
    docValue,
    docDescription,
    value,
    pageUrl,
    videoUrl,
    graduates: newGraduates,
    experiences: newExperiences,
    specialties: newSpecialties,
    });

    if (!disabledSubmit &&
        !errorName && !errorEmail && !errorDoc &&
        !errorBirth && !errorPhone && !errorDescription &&
        !errorDocDescription && !errorDocValue && !errorValue &&
        !errorCollege && !errorSpecialty && !errorEspecialties
      ) {
      dispatch(
        requestCreateProfile({
          name,
          doc,
          email,
          birthDate,
          phoneNumber: phoneValid,
          avatar,
          address: '',
          number: '',
          complement: '',
          neighborhood: '',
          state: '',
          city: '',
          cep: '',
          description,
          docValue,
          docDescription,
          value,
          pageUrl,
          videoUrl,
          graduates: newGraduates,
          experiences: newExperiences,
          specialties: newSpecialties,
        })
      );
    }
  }

  function hanldeGraduate(gradItem) {
    if (!gradItem) {
      return
    }
    setErrorCollege(false);
    setCollege('');
    setGraduates([...graduates, gradItem]);
  }

  useEffect(() => {
    if (graduates) {
      const kk = graduates.map(it => (
        {college: it}
      ))
      
      setNewGraduates(kk)
    }
  }, [graduates]);

  function handleExperience(experItem) {
    setErrorSpecialty(false);
    setSpecialty('');
    setExperiences([...experiences, experItem]);
  }

  useEffect(() => {
    if (experiences) {
      const kk = experiences.map(espec => (
        {especialty: espec}
      ))
      
      setNewExperiences(kk)
    }
  }, [experiences]);

  function handleSpecialty(specialItem) {
    const especials = specialties.find(spec => spec.id === specialItem.id);
    if (especials) {
      setSearch('');
      return;
    } else {
      setSpecialties([...specialties, specialItem]);
      setSearch('');
    }
  }

  useEffect(() => {
    if (specialties) {
      const kk = specialties.map(espec => (
        {id: espec.id}
      ))
      
      setNewSpecialties(kk)
    }
  }, [specialties]);

  const setProfi = (sub) => {
    setErrorEspecialties(false)
    setSearch(sub.description);
    setDisplay(false);
    setSearch('');
    handleSpecialty(sub)
  };

  const handleCancelGraduate = (graduate) => {
    const graduats = graduates.filter((grads) => (grads !== graduate));
    setGraduates(graduats);
  };

  const handleCancelExperience = (expiriences) => {
    setExperiences(experiences.filter(special => special !== expiriences));
  };

  const handleCancelSpecialty = (especialtyId) => {
    setSpecialties(specialties.filter(special => special.id !== especialtyId));
  };

  const handleCpf = (num) => {
    setDoc(mask(num.target.value, ['999.999.999-99']));
  };

  const handlePhone = (numPhone) => {
    setPhone(mask(numPhone.target.value, ['(99) 99999-9999']));
  };

  useEffect(() => {
    if (phone.length === 15) {
      const newTel = `+55${phone.substr(1, 2)}${phone.substr(
        5,
        12,
      )}`;
      setPhoneValid(newTel.replace('-', ''));
    }
  }, [phone]);

  const handleAvatar = (fileImage) => {
    setAvatar(fileImage);
  };

  useEffect(() => {
    // console.log(JSON.stringify(birthDate))
    if (search.length > 0) {
      setDisplay(true)
    }

  }, [search])

  function handleNameError() {
    name.length > 0 ? setErrorName(false) : setErrorName(true)
  }

  function handleEmailError() {
    dispatch(clearEmailError());
    function validateEmail(text) {
      var re = /\S+@\S+\.\S+/;
      return re.test(text);
    }

    if (email.length > 0 && validateEmail(email)) {
      setErrorEmail(false)
    } else {
      setErrorEmail(true)
    }
  }

  async function handleDocError() {
    dispatch(clearDocError())
    if (doc.length === 14) {
      const existDoc = await validateCpf(doc);

      if (existDoc) {
        setErrorDoc(false);
      } else {
        setErrorDoc(true)
      }
    } else {
      setErrorDoc(true)
    }
  }

  function handleBirthError() {
    dispatch(clearBirthError())
    const birthString = JSON.stringify(birthDate);
    if (birthString.length === 12) {
      if (DateHelper.limitBornDateMayoritValidation(birthDate)) {
        setErrorBirth(false);
      } else {
        dispatch(setBirthError());
        setErrorBirth(true);
      }
    } else {
      setErrorBirth(true);
    }
  }

  function handlePhoneError() {
    dispatch(clearPhoneError());
    if (phone.length === 15) {
      setErrorPhone(false)
    } else {
      setErrorPhone(true)
    }
  }

  function handleDescriptionError() {
    description.length > 0 ? setErrorDescription(false) : setErrorDescription(true)
  }

  function handleDocDescriptionError() {
    docDescription.length > 0 ? setErrorDocDescription(false) : setErrorDocDescription(true)
  }

  function handleDocValueError() {
    docValue.length > 0 ? setErrorDocValue(false) : setErrorDocValue(true)
  }

  function handleValueError() {
    value.length > 0 ? setErrorValue(false) : setErrorValue(true)
  }

  function handleCollegeError() {
    newGraduates.length > 0 && college.length > 0 ? setErrorCollege(false) : setErrorCollege(true)
  }

  function handleSpecialtyError() {
    newExperiences.length > 0 ? setErrorSpecialty(false) : setErrorSpecialty(true)
  }

  function handleEspecialtiesError() {
    specialties.length > 0 ? setErrorEspecialties(false) : setErrorEspecialties(true)
  }

  useEffect(() => {
    if (emailError) {
      setErrorEmail(true)
    }
    if (!validDoc) {
      setErrorDoc(true)
    }
    if (birthError) {
      setErrorBirth(true);
    }
    if (phoneError) {
      setErrorPhone(true);
    }
  }, [emailError, validDoc, birthError, phoneError])

  useEffect(() => {
    if (errorName || errorEmail || errorDoc || errorBirth || errorPhone || errorDescription || errorDocDescription || errorDocValue || errorValue || errorCollege || errorSpecialty || errorEspecialties) {
      setDisableSubmit(true)
      dispatch(cancelLoading())
    } else {
      setDisableSubmit(false)
    }
  }, [
    errorName,
    errorEmail,
    errorDoc,
    errorBirth,
    errorPhone,
    errorDescription,
    errorDocValue,
    errorDocDescription,
    errorValue,
    errorCollege,
    errorSpecialty,
    errorEspecialties,
  ])

  return (
    // <Formik
    //   initialValues={initialValues}
    //   validationSchema={validationSchema}
    //   onSubmit={onSubmit}
    //   enableReinitialize={false}
    //   >
    //   {({ values, handleChange, handleBlur, handleSubmit, setFieldTouched, isSubmitting, errors ,isValid}) => (
        <form onSubmit={onSubmit}>
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
              <FormControl isInvalid={errorName}>
              <Input
                name="name"
                id="name"
                onChange={(t) => setName(t.target.value)}
                value={name}
                type="text"
                placeholder="Nome Completo"
                errorBorderColor="crimson"
                align="center"
                onBlur={() => handleNameError()}
                width="400px"
                mt="15px"
              />
              <FormErrorMessage>Nome é obrigatório</FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              E-mail
            </Heading>
            <FormControl isInvalid={errorEmail}>
              <Input
                name="email"
                id="email"
                align="center"
                onBlur={handleEmailError}
                onChange={(t) => setEmail(t.target.value)}
                value={email}
                type="email"
                placeholder="E-mail"
                errorBorderColor="crimson"
                width="400px"
                mt="15px"
              />
              <FormErrorMessage>{emailError ? 'E-mail já cadastrado na nossa base de dados' : 'Preencha um e-mail válido.'}</FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
             CPF
            </Heading>
            <FormControl isInvalid={errorDoc}>
              <Input
                name="doc"
                align="center"
                onBlur={handleDocError}
                onChange={handleCpf}
                value={doc}
                type="text"
                placeholder="555.555.555-55"
                errorBorderColor="crimson"
                width="400px"
                mt="15px"
              />
              <FormErrorMessage>{!validDoc ? 'CPF já cadastrado na nossa base de dados' : 'Preencha um CPF válido.'}</FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Data de nascimento
            </Heading>

            <FormControl isInvalid={errorBirth}>
              <Input
                name="birthDate"
                align="center"
                onBlur={handleBirthError}
                onChange={(t) => setBirthDate(t.target.value)}
                value={birthDate}
                type="date"
                placeholder="11/11/1111"
                errorBorderColor="crimson"
                width="400px"
                mt="15px"
              />
              <FormErrorMessage>{birthError ? 'O profissional deve ser maior de 18 anos' : 'Preencha a data de nascimento.'}</FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Telefone
            </Heading>
            <FormControl isInvalid={errorPhone}>
              <Input
                name="phone"
                align="center"
                onBlur={handlePhoneError}
                onChange={handlePhone}
                value={phone}
                type="phone"
                placeholder="DD-XXXXX-XXXX"
                errorBorderColor="crimson"
                width="400px"
                mt="15px"
              />
              <FormErrorMessage>{phoneError ? 'Telefone já cadastrado na nossa base de dados' : 'Preencha um telefone válido.'}</FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Avatar
            </Heading>
            
            <Input
              name="avatar"
              align="center"
              padding="6px"
              // onBlur={handleBlur}
              onChange={handleAvatar}
              // value={avatar}
              type="file"
              accept="image/*"
              errorBorderColor="crimson"
              width="400px"
              mt="15px"
            />
          </Flex>
          </Grid>
          
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
              <FormControl isInvalid={errorDescription}>
                <Textarea
                  name="description"
                  onBlur={handleDescriptionError}
                  onChange={(t) => setDescription(t.target.value)}
                  value={description}
                  placeholder="Sobre o profissional"
                  size="sm"
                  height="50px"
                  errorBorderColor="crimson"
                  mt="15px"
                  width="1460px"
                />
                <FormErrorMessage>Escreva sobre o profissonal</FormErrorMessage>
            </FormControl>
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
              <FormControl isInvalid={errorDocDescription}>
                <Input
                  name="docDescription"
                  align="center"
                  onBlur={handleDocDescriptionError}
                  onChange={(t) => setDocDescription(t.target.value)}
                  value={docDescription}
                  type="text"
                  placeholder="CRP"
                  errorBorderColor="crimson"
                  width="400px"
                  mt="15px"
                />
                <FormErrorMessage>Preencha o tipo do documento</FormErrorMessage>
              </FormControl>
            </Flex>
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Número do documento
            </Heading>
            <FormControl isInvalid={errorDocValue}>
              <Input
                name="docValue"
                align="center"
                onBlur={handleDocValueError}
                onChange={(t) => setDocValue(t.target.value)}
                value={docValue}
                type="text"
                placeholder="1234/6"
                errorBorderColor="crimson"
                width="400px"
                mt="15px"

              />
              <FormErrorMessage>Preencha o número do documento</FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
             Valor por consulta
            </Heading>
            <FormControl isInvalid={errorValue}>
            <Input
              name="value"
              align="center"
              onBlur={handleValueError}
              onChange={(v) => setValue(v.target.value)}
              value={value}
              type="number"
              placeholder="R$ 150,00"
              errorBorderColor="crimson"
              width="400px"
              mt="15px"
            />
            <FormErrorMessage>Preencha o valor por consulta</FormErrorMessage>
            </FormControl>
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

              <Input
                name="pageUrl"
                align="center"
                onChange={(p) => setPageUrl(p.target.value)}
                value={pageUrl}
                type="text"
                placeholder="https://www.linkedin.com/"
                errorBorderColor="crimson"
                width="650px"
                mt="15px"

              />
            </Flex>
            <Flex direction="column" align="flex-start" width="650px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
            Link do vídeo de apresentação
            </Heading>

            <Input
              name="videoUrl"
              align="center"
              onChange={(v) => setVideoUrl(v.target.value)}
              value={videoUrl}
              type="text"
              placeholder="https://www.youtube.com/"
              errorBorderColor="crimson"
              width="650px"
              mt="15px"

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
                  <FormControl isInvalid={errorCollege}> 
                      <Input
                        name="college"
                        align="center"
                        onBlur={handleCollegeError}
                        onChange={(c) => setCollege(c.target.value)}
                        value={college}
                        type="text"
                        placeholder="Faculdade Federal de SP"
                        errorBorderColor="crimson"
                        width="600px"
                      mt="15px"

                      />
                    <FormErrorMessage>Preencha a formação</FormErrorMessage>
                  </FormControl>
                  <Button onClick={() => hanldeGraduate(college)} background="#6E8BC6" variant="solid" color="#fff" mt="15px" ml="10px">
                    + 
                  </Button>
                </Flex>

              <Flex direction="column" p="5px">
                {graduates.map((graduate, index) => (
                  <Flex key={index} direction="row" p="5px" align="center">
                    <Text>{graduate}</Text>
                    <button style={{
                      background: "#6E8BC6", height: 16, width: 16, borderRadius: 8, alignItems: 'center', color: '#FFF', marginLeft: 10, justifyContent: 'center'
                    }} onClick={() => handleCancelGraduate(graduate)} type="button">
                      <p style={{paddingBottom: 5}}>x</p>
                    </button>
                  </Flex>
                ))}
              </Flex>

            </Flex>
            <Flex direction="column" align="flex-start" width="600px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
            Experiências profissionais
            </Heading>

            <Flex direction="row">
              <FormControl isInvalid={errorSpecialty}> 
                <Input
                  name="specialty"
                  align="center"
                  onBlur={handleSpecialtyError}
                  onChange={(e) => setSpecialty(e.target.value)}
                  value={specialty}
                  type="text"
                  placeholder="5 anos de experiência na área organizacional"
                  errorBorderColor="crimson"
                  width="600px"
                  mt="15px"

                />
                <FormErrorMessage>Preencha a experiência profissional</FormErrorMessage>
              </FormControl>
              <Button onClick={() => handleExperience(specialty)} background="#6E8BC6" variant="solid" color="#fff" mt="15px" ml="10px">
                + 
              </Button>
            </Flex>

            <Flex direction="column" p="5px">
              {experiences.map((experience, index) => (
                <Flex key={index} direction="row" p="5px" align="center">
                  <Text>{experience}</Text>
                  <button style={{
                      background: "#6E8BC6", height: 16, width: 16, borderRadius: 8, alignItems: 'center', color: '#FFF', marginLeft: 10, justifyContent: 'center'
                    }} onClick={() => handleCancelExperience(experience)}>
                    x
                  </button>
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
              <FormControl isInvalid={errorEspecialties}> 
                <Input
                  name="specialties"
                  align="center"
                  onBlur={handleEspecialtiesError}
                  onChange={(s) => setSearch(s.target.value)}
                  value={search}
                  type="text"
                  placeholder="Ansiedade"
                  errorBorderColor="crimson"
                  width="650px"
                  mt="15px"
                />
                <FormErrorMessage>Escolha ao menos uma especialidade</FormErrorMessage>
              </FormControl>
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
              {specialties.map((specialty, index) => (
                  <Flex key={index} direction="row" p="5px" align="center" border="1px" borderColor="gray.400" borderRadius="4px" mr="5px" justifyContent="flex-start" >
                    <Text>{specialty.description}</Text>
                    <button style={{
                      background: "#6E8BC6", height: 16, width: 16, borderRadius: 8, alignItems: 'center', color: '#FFF', marginLeft: 10, justifyContent: 'center'
                    }} onClick={() => handleCancelSpecialty(specialty.id)}>x</button>
                  </Flex>
              ))}
            </Flex>
          
          </Grid>
          <Flex backgroundColor="#f1f0ef" justifyContent="center" pb="15px">
            {/* <button
              style={{
                width: 400,
                background: theme.colors.purple[600],
                color: theme.colors.white,
                marginTop: 4,
                height: 45,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 500
              }}
              // isLoading={isSubmitting}
              // type="submit"
              onClick={onSubmit}
              disabled={disabledSubmit}
            >
              Cadastrar
            </button> */}

            <Button
              width="400px"
              mt={4}
              isLoading={loading}
              onClick={onSubmit}
              background={theme.colors.purple[600]}
              color={theme.colors.white}
              isDisabled={disabledSubmit}
            >
              Cadastrar
            </Button>
            
          </Flex>
          
        </form>
    //   )}
    // </Formik>
  );
}

// <Flex  
//   backgroundColor="#f1f0ef"
//   direction="column" align="flex-start" padding="10px">
//   <Heading marginBottom={-5} color="gray.600" fontWeight="600" size="md"padding="5px" mb="-15px">
//     Endereço
//   </Heading>
// </Flex>
// <Flex 
//   backgroundColor="#f1f0ef"
//   direction="column" align="flex-start"  padding="10px">
//   <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
//       CEP
//     </Heading>

//     <ChakraInput
//       name="cep"
//       align="center"
//       onBlur={handleBlur}
//       onChange={handleChange}
//       value={values.cep}
//       type="text"
//       placeholder="11111-111"
//       errorBorderColor="crimson"
//       width="400px"
//     />
// </Flex>
// <Grid
//   templateColumns="1fr 1fr 1fr "
//   // gridAutoRows="150px"
//   gap={3}
//   backgroundColor="#f1f0ef"
// >
//   <Flex direction="column" align="flex-start" width="400px" padding="10px">
//     <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
//       Rua
//     </Heading>

//     <ChakraInput
//       name="address"
//       align="center"
//       onBlur={handleBlur}
//       onChange={handleChange}
//       value={values.address}
//       type="text"
//       placeholder="Rua, Avendida, etc..."
//       errorBorderColor="crimson"
//       width="400px"
//     />
//   </Flex>
//   <Flex direction="column" align="flex-start" width="400px" padding="10px">
//   <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
//     Número
//   </Heading>

//   <ChakraInput
//     name="number"
//     align="center"
//     onBlur={handleBlur}
//     onChange={handleChange}
//     value={values.number}
//     type="text"
//     placeholder="Número"
//     errorBorderColor="crimson"
//     width="400px"
//   />
// </Flex>
// <Flex direction="column" align="flex-start" width="400px" padding="10px">
//   <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
//    Complemento
//   </Heading>

//   <ChakraInput
//     name="complement"
//     align="center"
//     onBlur={handleBlur}
//     onChange={handleChange}
//     value={values.complement}
//     type="text"
//     placeholder="Casa, apartamento, etc..."
//     errorBorderColor="crimson"
//     width="400px"
//   />
// </Flex>
// </Grid>
// <Grid
//   templateColumns="1fr 1fr 1fr "
//   // gridAutoRows="150px"
//   gap={3}
//   backgroundColor="#f1f0ef"
// >
//   <Flex direction="column" align="flex-start" width="400px" padding="10px">
//     <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
//       Bairro
//     </Heading>

//     <ChakraInput
//       name="neighborhood"
//       align="center"
//       onBlur={handleBlur}
//       onChange={handleChange}
//       value={values.neighborhood}
//       type="text"
//       placeholder="Bairro"
//       errorBorderColor="crimson"
//       width="400px"
//     />
//   </Flex>
//   <Flex direction="column" align="flex-start" width="400px" padding="10px">
//   <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
//     Cidade
//   </Heading>

//   <ChakraInput
//     name="city"
//     align="center"
//     onBlur={handleBlur}
//     onChange={handleChange}
//     value={values.city}
//     type="text"
//     placeholder="Cidade"
//     errorBorderColor="crimson"
//     width="400px"
//   />
// </Flex>
// <Flex direction="column" align="flex-start" width="400px" padding="10px">
//   <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
//    Estado
//   </Heading>

//   <ChakraInput
//     name="state"
//     align="center"
//     onBlur={handleBlur}
//     onChange={handleChange}
//     value={values.state}
//     type="text"
//     placeholder="Ex: SP"
//     errorBorderColor="crimson"
//     width="400px"
//   />
// </Flex>
// </Grid>