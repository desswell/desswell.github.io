import React, {useEffect, useState} from 'react'
import Stepper from "../components/Steppper";
import {AddIcon} from "../icons";
import {Advantages} from "../components/Advantages";
import {
    addAdvantagesAction, setCheckBoxAction, setRadioAction,
    useAdvantages,
    useCheckBox,
    useRadio
} from "../store_redux/slices/dataUser";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup} from '@mui/material';
import Button from "../components/Button";
import {schemaSecondPage, schemaSecondPageAdvantages} from "../components/Yup";
import Error from "../components/Error";
import {Div, DivButtons, DivInput} from "../components/DivContainer";
import LabelTitle from "../components/Label";



export function SecondPage() {
    const navigate = useNavigate()
    const advantages = useAdvantages()
    const advantageObj = advantages.map((value, index) => {
        return {id: index, value}
    })
    const [errors, setErrors] = useState([])
    const dispatch = useDispatch()
    const radio= useRadio()
    const [checkBox, setCheckBox] = useState(useCheckBox())
    const [errorCheckBox, setErrorCheckBox] = useState(undefined)
    const [errorRadio, setErrorRadio] = useState(undefined)
    const HandleClickAdd = () => {
        dispatch(addAdvantagesAction(''))
    }
    const HandleClick = () => {
        setErrors([])
        advantages.map((value, index) => {
            try {
                schemaSecondPageAdvantages.validateSync({
                    advantages: value,
                })
                setErrors((state) => [...state, null])
            } catch (error) {
                setErrors((state) => [...state, error.message])
            }
        })
        try {
            schemaSecondPage.validateSync({
                checkBox: checkBox,
                radioGroup: radio
            }, {abortEarly: false})
            setErrorRadio(null)
            setErrorCheckBox(null)
        } catch (error) {
                const errors = error.errors
                if (errors.length === 2){
                    setErrorCheckBox(errors[0])
                    setErrorRadio(errors[1])
                } else if (errors[0].includes('select')){
                    setErrorCheckBox(errors[0])
                    setErrorRadio(null)
                } else {
                    setErrorCheckBox(null)
                    setErrorRadio(errors[0])
                }
        }
    }
    useEffect(() => {
        if (errors.every((element) => element === null) && errors.length === advantages.length
        && errorRadio === null && errorCheckBox === null) {
            dispatch(setCheckBoxAction(checkBox))
            navigate('/create/3')
        }
    }, [errors])

    return (
        <Div>
            <Stepper step={1}/>
            <DivInput>
                <LabelTitle>Advantages</LabelTitle>
                {advantageObj.map((data, index) =>
                        <Advantages props={data} error={errors[index]} setError={setErrors} key={data.id}/>
                    )}
                <button data-testid="button add" className="button-add" onClick={HandleClickAdd}><AddIcon/></button>
            </DivInput>
            <DivInput className='CheckboxWrapper'>
                <LabelTitle>Checkbox group</LabelTitle>
                <FormGroup className="CheckBox" onChange={(event) => {
                    const value = event.target.value
                    if (!checkBox.includes(value)) {
                        setCheckBox([...checkBox, value])
                    }
                    if (checkBox.includes(value)) {
                        setCheckBox(checkBox.filter((item) => item !== value))
                    }
                }}>
                    <FormControlLabel data-testid="field-checkbox-group-option-1" value={1} control={<Checkbox checked={checkBox.includes('1')}/>} label="1"/>
                    <FormControlLabel data-testid="field-checkbox-group-option-2" value={2} control={<Checkbox checked={checkBox.includes('2')}/>} label="2"/>
                    <FormControlLabel data-testid="field-checkbox-group-option-3" value={3} control={<Checkbox checked={checkBox.includes('3')}/>} label="3"/>
                </FormGroup>
                {errorCheckBox && <Error>{errorCheckBox}</Error>}
            </DivInput>
            <DivInput className='RadioWrapper'>
                <LabelTitle>Radio group</LabelTitle>
                <FormControl className='radio-group'>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={radio}
                        onChange={e => dispatch(setRadioAction(e.target.value))}
                    >
                        <FormControlLabel data-testid="field-radio-group-option-1" value="1" control={<Radio/>} label="1"/>
                        <FormControlLabel data-testid="field-radio-group-option-2" value="2" control={<Radio/>} label="2"/>
                        <FormControlLabel data-testid="field-radio-group-option-3" value="3" control={<Radio/>} label="3"/>
                    </RadioGroup>
                </FormControl>
                {errorRadio && <Error>{errorRadio}</Error>}
            </DivInput>
            <DivButtons>
                <Button data-testid="button-back" outline onClick={() => {
                    dispatch(setCheckBoxAction(checkBox))
                    navigate('/create/1')
                }}>Назад</Button>
                <Button data-testid="button-next" onClick={HandleClick}>Далее</Button>
            </DivButtons>
        </Div>
    )
}