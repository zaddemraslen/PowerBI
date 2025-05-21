import { Card, CardContent, Typography } from '@mui/material';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const ChartCard = ({ title, children, style }: ChartCardProps) => (
  <Card elevation={3} style={{ marginTop: '67px', marginLeft: 10, marginBottom: 15, padding: 0, ...style }}>
    <CardContent style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 2 }}>
      <Typography variant="h6" align="center" width="100%" gutterBottom>
        {title} 
      </Typography>
      {children}
    </CardContent>
  </Card>
);