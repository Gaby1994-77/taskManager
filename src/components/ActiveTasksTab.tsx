import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface Task {
  name: string;
  date: Date;
  completed: boolean;
  creationOrder: number;
}

export interface ActiveTasksTabProps {
  tasks: Task[];
  onCreateTask: (
    taskName: string,
    taskDate: Date,
    creationOrder: number
  ) => void;
  onCompleteTask: (task: Task) => void;
  onDeleteTask: (index: number) => void;
  onDeleteAllTasks: () => void;
  isLoading: boolean;
  searchQuery: string;
}

const ActiveTasksTab: React.FC<ActiveTasksTabProps> = ({
  tasks,
  onCreateTask,
  onCompleteTask,
  onDeleteTask,
  onDeleteAllTasks,
  isLoading,
  searchQuery,
}) => {
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState<Date | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDate(new Date(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taskName.trim() !== "" && taskDate) {
      const creationOrder = Date.now();
      onCreateTask(taskName.trim(), taskDate, creationOrder);
      setTaskName("");
      setTaskDate(null);
    }
  };

  const handleDeleteClick = (task: Task) => {
    const index = tasks.findIndex((t) => t === task);
    if (index !== -1) {
      setDeleteIndex(index);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      onDeleteTask(deleteIndex);
      setDeleteIndex(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteIndex(null);
    setDeleteDialogOpen(false);
  };

  const handleCompleteTask = (task: Task) => {
    onCompleteTask(task);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <form onSubmit={handleSubmit} style={{ width: "95%" }}>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          alignItems="center"
        >
          <TextField
            label="New Task"
            variant="outlined"
            value={taskName}
            onChange={handleChange}
            fullWidth={!isMobile}
            sx={{
              marginRight: isMobile ? "0" : "5px",
              marginBottom: isMobile ? "8px" : "0",
            }}
            disabled={isLoading}
          />
          <TextField
            type="date"
            variant="outlined"
            value={taskDate ? taskDate.toISOString().split("T")[0] : ""}
            onChange={handleDateChange}
            sx={{
              marginLeft: isMobile ? "0" : "10px",
              width: isMobile ? "100%" : "40%",
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!taskName.trim() || !taskDate || isLoading}
            sx={{
              marginLeft: isMobile ? "0" : "8px",
              width: isMobile ? "100%" : "30%",
            }}
          >
            Create
          </Button>
        </Box>
      </form>

      <div style={{ height: "50vh", overflowY: "auto", width: "100%" }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography variant="body1" color={"lightgray"}>
              No Active tasks
            </Typography>
          </Box>
        ) : (
          tasks
            .slice()
            .sort((a, b) => b.creationOrder - a.creationOrder)
            .map((task, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent={isMobile ? "space-between" : "space-between"}
                mt={1}
                width="100%"
              >
                <Box display="flex" alignItems="center">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => handleCompleteTask(task)}
                    sx={{ marginLeft: isMobile ? "1.5" : "1" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      width: isMobile ? "100%" : "145px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginLeft: isMobile ? "5px" : "5px",
                    }}
                  >
                    {task.name}
                  </Typography>
                  <Typography variant="body1" sx={{ marginLeft: "115px" }}>
                    {task.date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteClick(task)}
                  sx={{
                    marginRight: "40px",
                    marginTop: isMobile ? "8px" : "0",
                  }}
                >
                  Delete
                </Button>
              </Box>
            ))
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiveTasksTab;
