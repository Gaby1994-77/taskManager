import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface Task {
  name: string;
  date: Date;
}

interface CompletedTasksTabProps {
  tasks: Task[];
  isLoading: boolean;
  onMoveToActive: (taskName: string) => void;
  onDeleteTask: (taskName: string) => void;
  onDeleteAllTasks: () => void;
}

const CompletedTasksTab: React.FC<CompletedTasksTabProps> = ({
  tasks,
  isLoading,
  onMoveToActive,
  onDeleteTask,
  onDeleteAllTasks,
}) => {
  const [moveToActiveConfirmationOpen, setMoveToActiveConfirmationOpen] =
    useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteAllConfirmationOpen, setDeleteAllConfirmationOpen] =
    useState(false);
  const [selectedTaskName, setSelectedTaskName] = useState<string>("");
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.getBoundingClientRect().height;
      setContainerHeight(height);
    }
  }, [tasks]);

  const handleMoveToActive = (taskName: string) => {
    setSelectedTaskName(taskName);
    setMoveToActiveConfirmationOpen(true);
  };

  const handleDeleteTask = (taskName: string) => {
    setSelectedTaskName(taskName);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmMoveToActive = () => {
    onMoveToActive(selectedTaskName);
    setMoveToActiveConfirmationOpen(false);
  };

  const handleConfirmDeleteTask = () => {
    onDeleteTask(selectedTaskName);
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteAllTasks = () => {
    onDeleteAllTasks();
    setDeleteAllConfirmationOpen(false);
  };

  return (
    <Box>
      <Box maxHeight="50vh" overflow="auto" width="100%">
        <div ref={contentRef}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : tasks.length === 0 ? (
            <Typography
              variant="body1"
              align="center"
              mt={2}
              sx={{ margin: "28px" }}
              color={"lightgray"}
            >
              No completed tasks
            </Typography>
          ) : (
            tasks.map((task, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={1}
                width="100%"
                sx={{ margin: isMobile ? "10px 0" : "30px 30px 30px 0" }}
              >
                <Box display="flex" alignItems="center">
                  <Checkbox checked color="primary" sx={{ marginLeft: 1 }} />
                  <Typography variant="body1" sx={{ marginLeft: "5px" }}>
                    {task.name} -{" "}
                    {task.date.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleMoveToActive(task.name)}
                    sx={{ marginRight: isMobile ? "5px" : "10px" }}
                  >
                    Move to Active
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteTask(task.name)}
                    sx={{ marginRight: isMobile ? "5px" : "30px" }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </div>
      </Box>

      <Dialog
        open={moveToActiveConfirmationOpen}
        onClose={() => setMoveToActiveConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to move this Task to Active?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setMoveToActiveConfirmationOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmMoveToActive} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmationOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteTask} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
          <Button onClick={handleDeleteAllTasks} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Box mt={2} textAlign="center">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setDeleteAllConfirmationOpen(true)}
          sx={{ margin: "16px" }}
        >
          Delete Completed Tasks
        </Button>
      </Box>
    </Box>
  );
};

export default CompletedTasksTab;
