import React, { useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ActiveTasksTab, { ActiveTasksTabProps } from "./ActiveTasksTab";
import CompletedTasksTab from "./CompletedTasksTab";
import backgroundImage from "../assets/backgroundPattern.jpg";

export interface Task {
  name: string;
  date: Date;
  completed: boolean;
  creationOrder: number;
}

export interface CompletedTasksTabProps {
  tasks: Task[];
  isLoading: boolean;
  onMoveToActive: (taskName: string) => void;
  onDeleteTask: (taskName: string) => void;
  onDeleteAllTasks: () => void; // Added onDeleteAllTasks property
}

const TaskManager: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteAllConfirmationOpen, setDeleteAllConfirmationOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleCreateTask = (taskName: string, taskDate: Date) => {
    const newTask: Task = {
      name: taskName,
      date: taskDate,
      completed: false,
      creationOrder: activeTasks.length,
    };
    setActiveTasks([...activeTasks, newTask]);
  };

  const handleCompleteTask = (taskToComplete: Task) => {
    setCompletedTasks([...completedTasks, taskToComplete]);
    setActiveTasks(activeTasks.filter((task) => task !== taskToComplete));
  };

  const handleDeleteTask = (index: number) => {
    setActiveTasks(activeTasks.filter((_, i) => i !== index));
  };

  const handleDeleteAllTasks = () => {
    setDeleteAllConfirmationOpen(true);
  };

  const handleDeleteAllConfirmed = () => {
    setActiveTasks([]);
    setDeleteAllConfirmationOpen(false);
  };

  const handleMoveToActive = (taskName: string) => {
    const taskToMove = completedTasks.find((task) => task.name === taskName);
    if (taskToMove) {
      setActiveTasks([...activeTasks, { ...taskToMove, completed: false }]);

      setCompletedTasks(
        completedTasks.filter((task) => task.name !== taskName)
      );
    }
  };

  const handleDeleteCompletedTask = (taskName: string) => {
    setCompletedTasks(completedTasks.filter((task) => task.name !== taskName));
  };

  const handleSearchIconClick = () => {
    setSearchPopupOpen(true);
  };

  const handleSearch = (query: string) => {
    const foundTask = activeTasks.find(
      (task) => task.name.toLowerCase() === query.toLowerCase()
    );
    if (foundTask) {
      setSearchResult(`Task "${query}" found!`);
      setSelectedTask(foundTask);
    } else {
      setSearchResult(`Task "${query}" not found!`);
      setSelectedTask(null);
    }
  };

  const handleSearchClose = () => {
    setSearchPopupOpen(false);
    setSearchResult(null);
    setSelectedTask(null);
  };

  const handleSelectTask = () => {
    console.log("Task selected:", selectedTask);
  };

  const handleDeleteAllCompletedTasks = () => {
    setCompletedTasks([]);
    setDeleteAllConfirmationOpen(false);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <Grid item xs={12} md={8} lg={6}>
        <Paper elevation={3}>
          <Box
            sx={{
              bgcolor: "#FFF",
              boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
              <Tab label="Active Tasks" />
              <Tab label="Completed Tasks" />
            </Tabs>
          </Box>

          <Typography variant="h6" align="center" mt={2}>
            {tabIndex === 0 ? "Active Tasks" : "Completed Tasks"}
          </Typography>
          <Divider sx={{ backgroundColor: "#000" }} />
          <Box mt={2} textAlign="left" pl={2}>
            {tabIndex === 0 ? (
              <ActiveTasksTab
                tasks={activeTasks}
                onCreateTask={handleCreateTask}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
                onDeleteAllTasks={handleDeleteAllTasks}
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            ) : (
              <Box>
                <CompletedTasksTab
                  tasks={completedTasks}
                  isLoading={isLoading}
                  onMoveToActive={handleMoveToActive}
                  onDeleteTask={handleDeleteCompletedTask}
                  onDeleteAllTasks={handleDeleteAllCompletedTasks}
                />
                <Divider sx={{ backgroundColor: "#000" }} />
              </Box>
            )}
          </Box>
          <Box mt={2} textAlign="center">
            {tabIndex === 0 && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDeleteAllTasks}
                sx={{ margin: "16px" }}
              >
                Delete Active Tasks
              </Button>
            )}
          </Box>
          <Dialog
            open={deleteAllConfirmationOpen}
            onClose={() => setDeleteAllConfirmationOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete all Tasks?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteAllConfirmationOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteAllConfirmed} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={searchPopupOpen} onClose={handleSearchClose}>
            <DialogTitle>Search Task</DialogTitle>
            <DialogContent>
              <TextField
                label="Search Task"
                variant="outlined"
                fullWidth
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const inputElement = e.target as HTMLInputElement;
                    handleSearch(inputElement.value);
                  }
                }}
              />
              {searchResult && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Typography
                    variant="body1"
                    color={
                      searchResult.includes("not found") ? "error" : "inherit"
                    }
                  >
                    {searchResult}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSearchClose} color="primary">
                Close
              </Button>
              {selectedTask && (
                <Button onClick={handleSelectTask} color="primary">
                  Select Task
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TaskManager;
