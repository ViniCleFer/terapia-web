/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from "react";
import { Grid, Flex, Heading, Button, Text, Input } from "@chakra-ui/core";
// import { useToasts } from "react-toast-notifications";
import {useSelector, useDispatch} from 'react-redux';
// import axios from 'axios';
import { mask } from 'remask'
// import { toast } from "react-toastify";
// import NotificationCard from "../../NotificationCallCard";
import {Formik, Form} from 'formik';
import * as yup from 'yup';
// import {v4 as uuid} from 'uuid';

import { requestCreateProfile,
  clearDocError,
  setBirthError,
  clearEmailError,
  clearPhoneError,
  clearBirthError, } from '../../../store/modules/auth/actions';

import { getSubjectsRequest } from '../../../store/modules/specialty/actions';

import DocHelper from '../../../helpers/docValidate';
import DateHelper from '../../../helpers/dateValidate';

import theme from '../../../styles/theme';

import ChakraInput from "../../ChakraInput";
import ChakraTextarea from "../../ChakraTextarea";

import { 
  SubjectView,
  SubjectTouchable,
  SubjectText,
  // TextAlert,
 } from './styles';
// import { availableButtons } from "../../../store/modules/commons/actions";

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

  const phoneError = useSelector(state => state.auth.phoneError);
  const emailError = useSelector(state => state.auth.emailError);
  // const isValidDocReducer = useSelector(state => state.auth.validDoc);
  // const isValidEmailRecucer = useSelector(state => state.auth.validEmail);
  // const availableButtons = useSelector(
  //   state => state.commons.availableButtons,
  // );

  const [avatar, setAvatar] = useState('');
  const [doc, setDoc] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneValid, setPhoneValid] = useState('');
  // const [birth, setBirth] = useState({});
  // const [fmcToken, setFmcToken] = useState('');

  // const [isValidEmail, setIsValidEmail] = useState(true);
  // const [disabledSubmit, setDisableSubmit] = useState('');
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

  
  const [display, setDisplay] = useState(false);

  const subjectsReducer = useSelector((state) => state.specialty.subjects);
  const [subjects, setSubjects] = useState([]);

  const [search, setSearch] = useState('');

  // const { addToast } = useToasts();

  // function handleModal() {
  //   // addToast("teste", { appearance: "error" });
  //   toast(<NotificationCard />, { autoClose: false, closeOnClick: false });
  // }

  // useEffect(() => {
  //   if (!isValidDocReducer) {
  //     setDisableSubmit(true);
  //     setIsValidDoc(false);
  //   } else {
  //     setDisableSubmit(false);
  //     setIsValidDoc(true);
  //   }
  // }, [isValidDocReducer]);

  // useEffect(() => {
  //   if (!isValidEmailRecucer) {
  //     setDisableSubmit(true);
  //     setIsValidEmail(false);
  //     setEmailReason(
  //       'E-mail já cadastrado em nossa base de dados, efetue seu login',
  //     );
  //   } else {
  //     setDisableSubmit(false);
  //     setIsValidEmail(true);
  //   }
  // }, [isValidEmailRecucer]);

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


  // async function validateCep() {
  //   const testi = cep.replace('-', '');
  //   const response = await axios.get(`https://viacep.com.br/ws/${testi}/json`);
  //   setAdress(response.data.logradouro);
  //   setNeighborhood(response.data.bairro);
  //   setState(response.data.uf);
  //   setCity(response.data.localidade);
  // }

  const initialValues = {
    doc: "",
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    about: "",
    docDescription: "",
    docValue: "",
    value: "",
    college: "",
    especialty: "",
    avatar: "",
    specialties: "",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required('Preencha o nome'),
    email: yup
      .string()
      .email('E-mail inválido')
      .required('Preencha seu E-mail')
      .test('text', 'E-mail já cadastrado na nossa base de dados', text => {
        if ((text && emailError) || emailError) {
          return false;
        } else {
          return true;
        }
      }),
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
      .required('Preencha a data de nascimento')
      .test('date', 'O profissional deve ser maior de 18 anos.', (date) => {
        if (date) {
          if (DateHelper.limitBornDateMayoritValidation(date)) {
            return true;
          }
          dispatch(setBirthError());
          return false;
        }
        return true;
      }),
    phone: yup.string().required('Preencha o telefone').test('text', 'Telefone já cadastrado na nossa base de dados.', text => {
      if (phoneError) {
        return false;
      } else {
        return true;
      }
    }),
    about: yup.string().required('Escreva sobre o profissonal'),
    docDescription: yup.string().required('Preencha o tipo do documento'),
    docValue: yup.string().required('Preencha o número do documento'),
    value: yup.string().required('Preencha o valor por consulta'),
    college: yup.string().required('Preencha a formação'),
    especialty: yup.string().required('Preencha a experiência profissional'),
    specialties: yup.string().test('text', 'Escolha ao menos uma especialidade.', (text) => {
      if (text) {
        setSearch(text);
        setDisplay(true);
        return true;
      } else if (specialties.length > 0) {
        setDisplay(false);
        return true;
      } else {
        setDisplay(false);
        return false;
      }
    }),
  });

  function onSubmit(data) {
    alert('clicou função OnSunmit', data)
    // dispatch(
    //   requestCreateProfile({
    //     name: data.name,
    //     doc,
    //     email: data.email,
    //     birthDate: data.birthDate,
    //     phoneNumber: phoneValid,
    //     avatar,
    //     address: '',
    //     number: '',
    //     complement: '',
    //     neighborhood: '',
    //     state: '',
    //     city: '',
    //     cep: '',
    //     description: data.about,
    //     docValue: data.docValue,
    //     docDescription: data.docDescription,
    //     value: data.value,
    //     pageUrl: data.pageUrl,
    //     videoUrl: data.videoUrl,
    //     graduates: newGraduates,
    //     experiences: newExperiences,
    //     specialties,
    //   })
    // );
  }

  function hanldeGraduate(gradItem) {
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
    setExperiences([...experiences, experItem]);
  }

  useEffect(() => {
    if (experiences) {
      const kk = experiences.map(espec => (
        {especialty: espec}
      ))
      
      setNewExperiences(kk)
    }

  }, [graduates]);

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

  const setProfi = (sub) => {
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

  // useEffect(() => {
  //   console.log({avatar})

  // }, [avatar])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={false}
      >
      {({ values, handleChange, handleBlur, handleSubmit, setFieldTouched, isSubmitting, errors ,isValid}) => (
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
                id="name"
                onChange={handleChange}
                value={values.name}
                type="text"
                placeholder="Nome Completo"
                errorBorderColor="crimson"
                align="center"
                onBlur={() => setFieldTouched('name')}
                width="400px"
              />
            </Flex>
            <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              E-mail
            </Heading>

            <ChakraInput
              name="email"
              id="email"
              align="center"
              onBlur={() => (
                setFieldTouched('email'), dispatch(clearEmailError())
              )}
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
              onBlur={() => (
                setFieldTouched('doc'), dispatch(clearDocError())
              )}
              onChange={handleChange}
              value={() => handleCpf(values.doc)}
              // onChange={handleCpf}
              // value={doc}
              type="text"
              placeholder="555.555.555-55"
              errorBorderColor="crimson"
              width="400px"
              mt="15px"
            />
          </Flex>
          <Flex direction="column" align="flex-start" width="400px" padding="10px">
            <Heading marginBottom={-5} color="gray.600" fontWeight="500" size="md"padding="5px" mb="-15px">
              Data de nascimento
            </Heading>

            <ChakraInput
              name="birthDate"
              align="center"
              onBlur={() => (
                setFieldTouched('birthDate'), dispatch(clearBirthError())
              )}
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

            <Input
              name="phone"
              align="center"
              error={errors.phone}
              onBlur={() => (
                setFieldTouched('phoneNumber'), dispatch(clearPhoneError())
              )}
              onChange={handlePhone}
              value={values.phone}
              type="phone"
              placeholder="DD-XXXXX-XXXX"
              errorBorderColor="crimson"
              width="400px"
              mt="15px"
            />
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

              <ChakraTextarea
                name="about"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.about}
                placeholder="Sobre o profissional"
                size="sm"
                height="50px"
                errorBorderColor="crimson"
                width="770%"
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
              type="number"
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

              <ChakraInput
                name="specialties"
                align="center"
                onBlur={handleBlur}
                onChange={handleChange}
                value={search}
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
            <Button
              width="400px"
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              onClick={handleSubmit}
              background={theme.colors.purple[600]}
              color={theme.colors.white}
            >
              Cadastrar
            </Button>
            
          </Flex>
          
        </Form>
      )}
    </Formik>
    
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