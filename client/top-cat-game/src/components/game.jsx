import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const API_BASE = 'https://top-cat-game.onrender.com/leadboard';

const MainCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  border: '4px solid #ffd700',
  marginTop: theme.spacing(2),
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#ffd700',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  marginBottom: theme.spacing(3),
}));

const TopPlayerCard = styled(Paper)(({ theme, rank }) => {
  const colors = {
    1: { bg: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', border: '#ffab00', medal: '👑' },
    2: { bg: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)', border: '#9e9e9e', medal: '🥈' },
    3: { bg: 'linear-gradient(135deg, #cd7f32 0%, #d4a574 100%)', border: '#bf6f2f', medal: '🥉' },
  };
  
  const color = colors[rank];
  
  return {
    background: color.bg,
    border: `3px solid ${color.border}`,
    borderRadius: '12px',
    padding: theme.spacing(2),
    color: rank === 1 ? '#333' : '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  };
});

const ScrollableTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: '400px',
  borderRadius: '10px',
  backgroundColor: 'rgba(102, 126, 234, 0.1)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(102, 126, 234, 0.1)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#ffd700',
    borderRadius: '4px',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: '#667eea',
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
  '&:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  borderLeft: index < 3 ? `4px solid ${['#ffd700', '#c0c0c0', '#cd7f32'][index]}` : 'none',
}));

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);


  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}?limit=100`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      console.log(data);
      
      // Handle both array and object responses
      let playersArray = Array.isArray(data) ? data : [];
      
      // If data is an object with a players property
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        playersArray = data.leaderboard || data.players || data.data || [];
      }
      
      // Ensure it's always an array
      if (!Array.isArray(playersArray)) {
        playersArray = [];
      }
      
      setPlayers(playersArray);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const topPlayers = players.slice(0, 15);
console.log(topPlayers);
  const player1 = topPlayers[0];
  const player10 = topPlayers[9];
  const player15 = topPlayers[14] ? topPlayers[14] : topPlayers[topPlayers.length - 1];

  const getRankMedal = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <MainCard>
        <CardContent sx={{ p: 4 }}>
          {/* Header Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <HeaderTypography>
              ⭐ Top Cats! ⭐
            </HeaderTypography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#fff' }}>

            </Box>
          </Box>

          {/* Top 3 Players Cards */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#ffd700' }} />
            </Box>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {/* Place 2 */}
                <Grid item xs={12} sm={6} md={4}>
                  {player10 ? (
                    <TopPlayerCard rank={2}>
                      <Typography sx={{ fontSize: '2rem', mb: 1 }}>🥈</Typography>
                      <Typography sx={{ fontSize: '0.9rem', mb: 1 }}>Place 10</Typography>
                      <Avatar
                        src={player10.avatarurl}
                        alt={player10.displayname}
                        sx={{ width: 60, height: 60, margin: '0 auto', mb: 1, border: '3px solid currentColor' }}
                      />
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                        {player10.displayname || player10.username}
                      </Typography>
                      <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        💎 {player10.score.toLocaleString()}
                      </Typography>
                    </TopPlayerCard>
                  ) : (
                    <TopPlayerCard rank={2}>
                      <Typography sx={{ color: '#999' }}>No Player</Typography>
                    </TopPlayerCard>
                  )}
                </Grid>

                {/* Place 1 - Center and Larger */}
                <Grid item xs={12} sm={12} md={4}>
                  {player1 ? (
                    <TopPlayerCard rank={1} sx={{ transform: 'scale(1.1)' }}>
                      <Typography sx={{ fontSize: '3rem', mb: 1 }}>👑</Typography>
                      <Typography sx={{ fontSize: '1rem', mb: 1, color: '#333' }}>Place 1</Typography>
                      <Avatar
                        src={player1.avatarurl}
                        alt={player1.displayname}
                        sx={{ width: 70, height: 70, margin: '0 auto', mb: 1, border: '4px solid #ffab00' }}
                      />
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', mb: 0.5, color: '#333' }}>
                        {player1.displayname || player1.username}
                      </Typography>
                      <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333' }}>
                        💎 {player1.score.toLocaleString()}
                      </Typography>
                    </TopPlayerCard>
                  ) : (
                    <TopPlayerCard rank={1}>
                      <Typography>No Player</Typography>
                    </TopPlayerCard>
                  )}
                </Grid>

                {/* Place 3 */}
                <Grid item xs={12} sm={6} md={4}>
                  {player15 ? (
                    <TopPlayerCard rank={3}>
                      <Typography sx={{ fontSize: '2rem', mb: 1 }}>🥉</Typography>
                      <Typography sx={{ fontSize: '0.9rem', mb: 1 }}>Place 15</Typography>
                      <Avatar
                        src={player15.avatarurl}
                        alt={player15.displayname}
                        sx={{ width: 60, height: 60, margin: '0 auto', mb: 1, border: '3px solid currentColor' }}
                      />
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', mb: 0.5 }}>
                        {player15.displayname || player15.username}
                      </Typography>
                      <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        💎 {player15.score.toLocaleString()}
                      </Typography>
                    </TopPlayerCard>
                  ) : (
                    <TopPlayerCard rank={3}>
                      <Typography sx={{ color: '#999' }}>No Player</Typography>
                    </TopPlayerCard>
                  )}
                </Grid>
              </Grid>

              {/* Full Leaderboard Table */}
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.2rem', mb: 2 }}>
                  📊 Full Rankings
                </Typography>
                <ScrollableTableContainer component={Paper}>
                  <Table stickyHeader>
                    <StyledTableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffd700' }}>
                          Rank
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#ffd700' }}>Player</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#ffd700' }}>
                          Score
                        </TableCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {topPlayers.map((player, idx) => (
                        <StyledTableRow key={player.id} index={idx}>
                          <TableCell align="center" sx={{ fontWeight: 'bold', color: '#ffd700', fontSize: '1.1rem' }}>
                            {getRankMedal(idx + 1)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={player.avatarurl}
                                alt={player.displayname}
                                sx={{ width: 32, height: 32, border: '2px solid #ffd700' }}
                              />
                              <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                                {player.displayname || player.username}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1rem' }}>
                              💎 {player.score.toLocaleString()}
                            </Typography>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollableTableContainer>
              </Box>
            </>
          )}
        </CardContent>
      </MainCard>
    </Container>
  );
};

export default Game;