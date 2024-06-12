// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const QuestionIndex = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [questionDescription, setQuestionDescription] = useState("");
  const [questionType, setQuestionType] = useState("");

  const [matrixRows, setMatrixRows] = useState("");
  const [matrixColumns, setMatrixColumns] = useState("");
  const [rowTitles, setRowTitles] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);

  const [options, setOptions] = useState("");
  const [choicesCount, setChoicesCount] = useState("");
  const [choiceValues, setChoiceValues] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/v1/question/get-all"
      );
      const formattedRows = response.data.map((question) => ({
        id: question.id,
        questionDescription: question.description,
        questionType: question.questionType,
        creationDate: new Date(question.creationDate).toLocaleDateString(),
        creationTime: new Date(question.creationDate).toLocaleTimeString(),
        updatedDate: new Date(question.updatedDate).toLocaleDateString(),
        updatedTime: new Date(question.updatedDate).toLocaleTimeString(),
      }));
      setRows(formattedRows);
    } catch (error) {
      console.error("Soru çekme hatası:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowTitleChange = (index, value) => {
    const updatedRowTitles = [...rowTitles];
    updatedRowTitles[index] = value;
    setRowTitles(updatedRowTitles);
  };
  const handleColumnTitleChange = (index, value) => {
    const updatedColumnTitles = [...columnTitles];
    updatedColumnTitles[index] = value;
    setColumnTitles(updatedColumnTitles);
  };
  const handleSave = async () => {
    try {
      let questionOptions = options;

      if (questionType === "LIKERT") {
        questionOptions = choiceValues.filter(Boolean).join(",");
      } else if (questionType === "MATRIKS") {
        questionOptions = JSON.stringify({
          rows: rowTitles,
          columns: columnTitles,
        });
      } else if (questionType === "OPEN_ENDED") {
        questionOptions = options;
      } else if (
        questionType === "MULTI_SELECTION" ||
        questionType === "SINGLE_SELECTION" ||
        questionType === "SINGLE_SELECTION_OTHER" ||
        questionType === "MULTI_SELECTION_OTHER"
      ) {
        questionOptions = processChoices();
      }

      const response = await axios.post(
        "http://localhost:8081/api/v1/question/save",
        {
          description: questionDescription,
          questionType: questionType,
          options: questionOptions,
        }
      );

      console.log("Yeni soru oluşturuldu:", response.data);
      setOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error("Soru oluşturma hatası:", error);
    }
  };

  const processChoices = () => {
    if (
      questionType === "MULTI_SELECTION" ||
      questionType === "SINGLE_SELECTION" ||
      questionType === "SINGLE_SELECTION_OTHER" ||
      questionType === "MULTI_SELECTION_OTHER"
    ) {
      return choiceValues.filter(Boolean).join(",");
    }
  };

  const handleChoicesChange = (index, value) => {
    const updatedChoiceValues = [...choiceValues];
    updatedChoiceValues[index] = value;
    setChoiceValues(updatedChoiceValues);
  };

  const renderMatrixInputs = () => {
    const rowInputs = [];
    const columnInputs = [];

    for (let i = 0; i < parseInt(matrixRows); i++) {
      rowInputs.push(
        <TextField
          key={i}
          margin="dense"
          id={`row-${i}`}
          label={`Satır ${i + 1}`}
          type="text"
          fullWidth
          value={rowTitles[i] || ""}
          onChange={(e) => handleRowTitleChange(i, e.target.value)}
        />
      );
    }

    for (let i = 0; i < parseInt(matrixColumns); i++) {
      columnInputs.push(
        <TextField
          key={i}
          margin="dense"
          id={`column-${i}`}
          label={`Sütun ${i + 1}`}
          type="text"
          fullWidth
          value={columnTitles[i] || ""}
          onChange={(e) => handleColumnTitleChange(i, e.target.value)}
        />
      );
    }

    return (
      <>
        <div>
          <InputLabel style={{ marginTop: "10px" }}>
            Satır Başlıkları
          </InputLabel>
          {rowInputs}
        </div>
        <div>
          <InputLabel style={{ marginTop: "10px" }}>
            Sütun Başlıkları
          </InputLabel>
          {columnInputs}
        </div>
      </>
    );
  };
  const renderChoicesInputs = () => {
    return Array.from({ length: parseInt(choicesCount) }).map((_, index) => (
      <TextField
        key={index}
        margin="dense"
        id={`choice-${index}`}
        label={`Seçenek ${index + 1}`}
        type="text"
        fullWidth
        value={choiceValues[index] || ""}
        onChange={(e) => handleChoicesChange(index, e.target.value)}
      />
    ));
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
        columns={[
          { field: "id", headerName: "ID", width: 150 },
          {
            field: "questionDescription",
            headerName: "Soru Açıklaması",
            width: 200,
          },
          { field: "questionType", headerName: "Soru Tipi", width: 200 },
          {
            field: "creationDate",
            headerName: "Oluşturulma Tarihi",
            width: 200,
          },
          {
            field: "creationTime",
            headerName: "Oluşturulma Saati",
            width: 200,
          },
          {
            field: "updatedDate",
            headerName: "Son Güncelleme Tarihi",
            width: 200,
          },
          {
            field: "updatedTime",
            headerName: "Son Güncelleme Saati",
            width: 200,
          },
        ]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 100]}
        checkboxSelection
      />

      <Button
        variant="contained"
        onClick={handleOpen}
        style={{
          position: "absolute",
          right: "10px",
        }}
      >
        YENİ SORU EKLE
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Yeni Soru Oluştur</DialogTitle>
        <DialogContent>
          <DialogContentText>Yeni bir soru ekleyin.</DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="questionType-label">Soru Tipi</InputLabel>
            <Select
              labelId="questionType-label"
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <MenuItem value="OPEN_ENDED">Açık Uçlu</MenuItem>
              <MenuItem value="LIKERT">Likert</MenuItem>
              <MenuItem value="MATRIKS">Matris</MenuItem>
              <MenuItem value="MULTI_SELECTION">Çoklu Seçim</MenuItem>
              <MenuItem value="SINGLE_SELECTION">Tekli Seçim</MenuItem>
              <MenuItem value="SINGLE_SELECTION_OTHER">
                Tekli Seçim Diğer
              </MenuItem>
              <MenuItem value="MULTI_SELECTION_OTHER">
                Çoklu Seçim Diğer
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            autoFocus
            margin="dense"
            id="questionDescription"
            label="Soru Açıklaması"
            type="text"
            fullWidth
            value={questionDescription}
            onChange={(e) => setQuestionDescription(e.target.value)}
          />

          {questionType === "LIKERT" ? (
            <>
              <TextField
                margin="dense"
                id="choicesCount"
                label="Seçenek sayısı"
                type="number"
                fullWidth
                value={choicesCount}
                onChange={(e) => setChoicesCount(e.target.value)}
              />
              {renderChoicesInputs()}
            </>
          ) : questionType === "MATRIKS" ? (
            <>
              <TextField
                margin="dense"
                id="matrixRows"
                label="Satır Sayısı"
                type="number"
                fullWidth
                value={matrixRows}
                onChange={(e) => setMatrixRows(e.target.value)}
              />
              <TextField
                margin="dense"
                id="matrixColumns"
                label="Sütun Sayısı"
                type="number"
                fullWidth
                value={matrixColumns}
                onChange={(e) => setMatrixColumns(e.target.value)}
              />
              {renderMatrixInputs()}
            </>
          ) : questionType === "SINGLE_SELECTION" ||
            questionType === "MULTI_SELECTION" ||
            questionType === "SINGLE_SELECTION_OTHER" ||
            questionType === "MULTI_SELECTION_OTHER" ? (
            <>
              <TextField
                margin="dense"
                id="choicesCount"
                label="Kaç Şık?"
                type="number"
                fullWidth
                value={choicesCount}
                onChange={(e) => setChoicesCount(e.target.value)}
              />
              {renderChoicesInputs()}
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleSave} color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuestionIndex;
