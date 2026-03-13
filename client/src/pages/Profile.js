import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    previousRole: '',
    experience: '',
    careerBreakDuration: '',
    desiredCareerPath: '',
    skills: [],
    certifications: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile');
      if (res.data.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/profile', profile);
      setMessage('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      setMessage('');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const addCertification = () => {
    if (certInput.trim() && !profile.certifications.includes(certInput.trim())) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, certInput.trim()],
      });
      setCertInput('');
    }
  };

  const removeCertification = (certToRemove) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.filter(cert => cert !== certToRemove),
    });
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Please log in to view your profile.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Career Profile
        </Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Previous Role"
                  value={profile.previousRole}
                  onChange={(e) => setProfile({ ...profile, previousRole: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Career Break Duration"
                  value={profile.careerBreakDuration}
                  onChange={(e) => setProfile({ ...profile, careerBreakDuration: e.target.value })}
                  placeholder="e.g., 3 years"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Work Experience"
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  placeholder="Describe your previous work experience..."
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Desired Career Path"
                  value={profile.desiredCareerPath}
                  onChange={(e) => setProfile({ ...profile, desiredCareerPath: e.target.value })}
                  placeholder="What career path are you interested in pursuing?"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add a skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button variant="contained" onClick={addSkill}>
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Certifications
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add a certification"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  />
                  <Button variant="contained" onClick={addCertification}>
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.certifications.map((cert, index) => (
                    <Chip
                      key={index}
                      label={cert}
                      onDelete={() => removeCertification(cert)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile;