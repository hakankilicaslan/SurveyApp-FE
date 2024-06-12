/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios"; 
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const SurveyIndex = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [surveyName, setSurveyName] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isRequired, setIsRequired] = useState(false);

  const getSurvey = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/survey/get-all");
      const formattedRows = response.data.map((survey) => ({
        id: survey.id,
        surveyName: survey.name,
        creationDate: new Date(survey.creationDate).toLocaleDateString(),
        creationTime: new Date(survey.creationDate).toLocaleTimeString(),
        updatedDate: new Date(survey.updatedDate).toLocaleDateString(),
        updatedTime: new Date(survey.updatedDate).toLocaleTimeString(),
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  const getQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/question/get-all");
      setQuestions(response.data);
    } catch (error) {
      console.error("Soru çekme hatası:", error);
    }
  };

  useEffect(() => {
    getSurvey();
    getQuestions();
  }, []);
    
  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "surveyName", headerName: "Anket İsmi", width: 200 },
    { field: "creationDate", headerName: "Oluşturulma Tarihi", width: 200 },
    { field: "creationTime", headerName: "Oluşturulma Saati", width: 200 },
    { field: "updatedDate", headerName: "Son Güncelleme Tarihi", width: 200 },
    { field: "updatedTime", headerName: "Son Güncelleme Saati", width: 200 },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateSurvey = async () => {
    try {
      const response = await axios.post("http://localhost:8081/api/v1/survey/save", {
        name: surveyName,
        questions: selectedQuestions.map(({ id, order, isRequired }) => ({
          questionId: id,
          index: order,
          required: isRequired
        }))
      });
      console.log("Yeni anket oluşturuldu:", response.data);
      setOpen(false);
      getSurvey();
    } catch (error) {
      console.error("Anket oluşturma hatası:", error);
    }
  };

  const handleAddQuestion = () => {
    setSelectedQuestions([...selectedQuestions, { id: "", order: "", isRequired: false }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions.splice(index, 1);
    setSelectedQuestions(updatedQuestions);
  };

  return (
    <div
      style={{
        height: "450px",
        width: "100%",
        paddingTop: "64px",
        paddingLeft: "250px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      <Button 
        variant="contained" 
        onClick={handleClickOpen}
        style={{
          position: "absolute",
          
          right: "10px",
        }}
      >
        YENİ ANKET EKLE
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Yeni Anket Oluştur</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lütfen yeni anketin detaylarını girin.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="surveyName"
            label="Anket İsmi"
            type="text"
            fullWidth
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
          />
          {selectedQuestions.map((selected, index) => (
            <div key={index}>
              <FormControl fullWidth>
                <InputLabel id={`select-question-label-${index}`}>Soru Seçimi</InputLabel>
                <Select
                  labelId={`select-question-label-${index}`}
                  id={`select-question-${index}`}
                  value={selected.id}
                  onChange={(e) => {
                    const updatedQuestions = [...selectedQuestions];
                    updatedQuestions[index].id = e.target.value;
                    setSelectedQuestions(updatedQuestions);
                  }}
                >
                  {questions.map((question) => (
                    <MenuItem key={question.id} value={question.id}>{question.description}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                id={`question-order-${index}`}
                label="Sorunun Sırası"
                type="number"
                fullWidth
                value={selected.order}
                onChange={(e) => {
                  const updatedQuestions = [...selectedQuestions];
                  updatedQuestions[index].order = e.target.value;
                  setSelectedQuestions(updatedQuestions);
                }}
              />
              <FormControlLabel
                control={<Checkbox checked={selected.isRequired} onChange={(e) => {
                  const updatedQuestions = [...selectedQuestions];
                  updatedQuestions[index].isRequired = e.target.checked;
                  setSelectedQuestions(updatedQuestions);
                }} />}
                label="Sorunun Zorunlu Olup Olmadığı"
              />
              <Button onClick={() => handleRemoveQuestion(index)}>Soruyu Kaldır</Button>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleCreateSurvey} color="primary">
            Oluştur
          </Button>
          <Button onClick={handleAddQuestion} color="primary">
            Soru Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SurveyIndex;
