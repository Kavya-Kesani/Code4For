import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const Analysis = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/analysis');
      setAnalysis(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch analysis. Please complete your profile first.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalysis();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Please log in to view your career analysis.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Career Re-Entry Analysis
        </Typography>
        <Button
          variant="contained"
          onClick={fetchAnalysis}
          disabled={loading}
          sx={{ mb: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Refresh Analysis'}
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {analysis && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Skill Gap Analysis</Typography>
                  </Box>
                  <Typography variant="body2">
                    {analysis.skillGapAnalysis}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Learning Roadmap</Typography>
                  </Box>
                  <Typography variant="body2">
                    {analysis.learningRoadmap}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Job Suggestions</Typography>
                  </Box>
                  <Typography variant="body2">
                    {analysis.jobSuggestions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <QuestionAnswerIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Interview Preparation</Typography>
                  </Box>
                  <Typography variant="body2">
                    {analysis.interviewPrep}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {!analysis && !loading && !error && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No analysis available yet.
            </Typography>
            <Typography variant="body2">
              Please complete your profile to get personalized career re-entry recommendations.
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Analysis;