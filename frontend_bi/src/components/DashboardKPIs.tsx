import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ProductionFlat } from '../types/ProductionType';
import { Commande } from '../types/CommandeType';
import {
    PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    ScatterChart,
    Scatter,
    CartesianGrid,
    Tooltip,
    ReferenceLine
  } from 'recharts';
import { blue, red, yellow } from '@mui/material/colors';
  
interface Props {
  productions: ProductionFlat[];
  commandes: Commande[];
}

const DashboardKPIs: React.FC<Props> = ({ productions, commandes }) => {
  const prodAvailable = productions && productions.length > 0;
  const cmdAvailable = commandes && commandes.length > 0;

  if (!prodAvailable || !cmdAvailable) {
    let availabilityMsg = '';
    if (!prodAvailable) availabilityMsg += '-- No production data available. ';
    if (!cmdAvailable) availabilityMsg += '-- No order data available.';
    return <div>{availabilityMsg.trim()}</div>;
  }
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1'];

  // Production KPIs
  const totalProdQuantity = productions.reduce((sum, p) => sum + (p.quantite || 0), 0);
  const quantityOccurrences: Record<number, number> = {};
    productions.forEach(p => {
    const qty = p.quantite || 0;
    quantityOccurrences[qty] = (quantityOccurrences[qty] || 0) + 1;
    });
  
  const prodTotalCost = productions.reduce((sum, p) => sum + (p.cout_production || 0), 0);
  const prodTotalRevenuePerUnit = productions.reduce((sum, p) => sum + ((p.prix_unitaire || 0) * (p.quantite || 0)), 0);
  const prodTotalTime = productions.reduce((sum, p) => sum + (p.temps_production || 0), 0);

  const prodCompletedCount = productions.filter(p => p.statut?.toLowerCase() === 'terminé').length;
  const prodInProgressCount = productions.filter(p => p.statut?.toLowerCase() === 'en cours').length;
  const prodPendingCount = productions.filter(p => p.statut?.toLowerCase() === 'en attente').length;
  const prodCount= productions.length;

  const DiamondShape = (props: any) => {
  const { cx, cy, fill } = props;
  return (
    <path
      d={`M${cx},${cy - 6} L${cx + 6},${cy} L${cx},${cy + 6} L${cx - 6},${cy} Z`}
      stroke="none"
      fill={fill}
    />
  );
};

  const ProdStatusData = [
  { name: 'In progress', value: prodInProgressCount },
  { name: 'Pending', value: prodPendingCount },
  { name: 'Completed', value: prodCompletedCount }
  ];
  const ProdAverageProductionTime = totalProdQuantity > 0 ? prodTotalTime / totalProdQuantity : 0;
  const ProdAverageUnitCost = totalProdQuantity > 0 ? prodTotalCost / totalProdQuantity : 0;
  const prodAverageUnitPrice = productions.reduce((sum, p) => sum + (p.prix_unitaire || 0), 0) / productions.length;

  const productTotals: Record<string, number> = {};
  productions.forEach(p => {
    const name = p.produit || 'Inconnu';
    productTotals[name] = (productTotals[name] || 0) + (p.quantite || 0);
  });
  const mostProducedProduct = Object.entries(productTotals).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max, ['', 0])[0];

  const clientData = Object.entries(
    commandes.reduce<Record<string, number>>((acc, c) => {
      const name = c.client || 'Inconnu';
      acc[name] = (acc[name] || 0) + (c.quantite || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  
  const productData = Object.entries(
    productions.reduce<Record<string, number>>((acc, p) => {
      const name = p.produit || 'Inconnu';
      acc[name] = (acc[name] || 0) + (p.quantite || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const averageProductData = productData.reduce((sum, item) => sum + item.value, 0) / productData.length;

  
  type Point = { idx: number; y: number; name: string };

  const costs: Point[] = [];
  const gains: Point[] = [];
  const revenues: Point[] = [];

  const productMap = new Map<string, { totalCost: number; totalRevenue: number }>();

  productions.forEach((p) => {
    const name = p.produit || 'Inconnu';
    const quantity = p.quantite || 0;
    const unitPrice = p.prix_unitaire || 0;
    const cost = p.cout_production || 0;
    const revenue = quantity * unitPrice;

    const existing = productMap.get(name) || { totalCost: 0, totalRevenue: 0 };
    existing.totalCost += cost;
    existing.totalRevenue += revenue;

    productMap.set(name, existing);
  });

  let index= 0
  for (const [name, { totalCost, totalRevenue }] of productMap.entries()) {
    const gain = totalRevenue - totalCost;
    costs.push({ idx: index, y: totalCost, name });
    revenues.push({ idx: index, y: totalRevenue, name });
    gains.push({ idx: index, y: gain, name });
    index++;
  }
  
  // Commande KPIs
  const totalCmdOrders = commandes.length;
  const totalCmdOrderedQuantity = commandes.reduce((sum, c) => sum + (c.quantite || 0), 0);
  const cmdDeliveredCount = commandes.filter(c => c.statut?.toLowerCase() === 'livrée').length;
  const cmdPendingCount = totalCmdOrders - cmdDeliveredCount;

  const orderStatusData = [
  { name: 'Pending', value: cmdPendingCount },
  { name: 'Delivered', value: cmdDeliveredCount }
];
  const clientCounts: Record<string, number> = {};
  commandes.forEach(c => {
    const name = c.client || 'Inconnu';
    clientCounts[name] = (clientCounts[name] || 0) + 1;
  });
  const topClientbycmd = Object.entries(clientCounts).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max, ['', 0])[0];

  const formatNumber = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  
  const topClientbyOrder= { label: 'Top Client (by Order)', value: topClientbycmd }
  const mostProducedProd= { label: 'Most Produced Product', value: mostProducedProduct }
  const totalProductionCost= { label: 'Total Production Cost', value: `${formatNumber(prodTotalCost)} €` }
  const totalEstimatedRevenue= { label: 'Total Estimated Revenue', value: `${formatNumber(prodTotalRevenuePerUnit)} €` }
  const totalCmdQuantity  ={ label: 'Total Quantity Ordered', value: formatNumber(totalCmdOrderedQuantity) }

    const kpis = [
      { label: 'Avg. Production Time / Item', value: `${formatNumber(ProdAverageProductionTime)} h` },
      { label: 'Avg. prod Unit Cost', value: `${formatNumber(ProdAverageUnitCost)} €` },
      { label: 'Avg. prod Unit Price', value: `${formatNumber(prodAverageUnitPrice)} €` },
    ];

  const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const idx = payload[0].payload.idx;
    const name = payload[0].payload.name;
    const cost = costs.find(c => c.idx === idx)?.y ?? 0;
    const revenue = revenues.find(r => r.idx === idx)?.y ?? 0;
    const gain = gains.find(g => g.idx === idx)?.y ?? 0;

  return (
      <div style={{ backgroundColor: 'rgb(245, 240, 240)', border: '1px solid #ccc', padding: 10, paddingTop:5, marginTop:5, minWidth:'170px' }}>
        <div style={{marginBottom:'0px', textAlign: 'center'}}><p><strong>{name}</strong></p></div>
        <div style={{ margin: '0', marginTop:'-10px', padding:'0', height:'25px', display:'flex', justifyContent:'space-between'}}>
          <p style={{fontStyle:'italic', marginTop:'0px', color:'#8884d8', fontWeight:'bold'}}>Cost:</p>
          <p style={{marginTop:'0px', color:'#8884d8', fontWeight:'bold'}}>{cost.toFixed(2)}$</p>
        </div>
        <div style={{margin: '0', padding:'0', height:'25px', display:'flex', justifyContent:'space-between'}}>
          <p style={{fontStyle:'italic',marginTop:'0px', color:'#82ca9d', fontWeight:'bold'}}>Revenue:</p>
          <p style={{marginTop:'0px', color:'#82ca9d', fontWeight:'bold'}}>{revenue.toFixed(2)}$</p>
        </div>
        <div style={{margin: '0', padding:'0', height:'25px', display:'flex', justifyContent:'space-between'}}>
          <p style={{fontStyle:'italic', marginTop:'0px', color:'#ff7300', fontWeight:'bold'}}>Gain:</p>
          <p style={{marginTop:'0px', color:'#ff7300', fontWeight:'bold'}}>{gain.toFixed(2)}$</p>
        </div>
      </div>
    );
  }

  return null;
};

  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' ,padding:0, marginTop:0, width:"100%", backgroundColor:"rgb(228, 231, 239)"}}>
    
    <div style={{  
      boxShadow: '0px 3px 5px -1px rgb(228, 231, 239), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
      padding: '0px',
      backgroundColor: 'white',
      marginBottom:"10px", marginLeft:"10px", width:'100%', display: 'flex' , marginTop:0, 
      borderRadius:'3px'
      }}>
        <div style={{ padding:'0px',
          margin:'0px',
          marginLeft:'15px',
          marginRight: '10px',
          paddingBottom:'10px',
          paddingTop:'15px',
          borderRight: '3px solid rgba(15, 15, 15, 0.3)',
          paddingRight: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',}}>
          <Typography variant="h6" gutterBottom>
            {topClientbyOrder.label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" >
            {topClientbyOrder.value}
          </Typography>
        </div>
        <div style={{ padding:'0px',
          margin:'0px',
          marginLeft:'15px',
          marginRight: '10px',
          paddingBottom:'10px',
          paddingTop:'15px',
          borderRight: '3px solid rgba(15, 15, 15, 0.3)',
          paddingRight: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',}}>
          <Typography variant="h6" gutterBottom>
            {mostProducedProd.label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" >
            {mostProducedProd.value}
          </Typography>
        </div>
        <div style={{ padding:'0px',
          margin:'0px',
          marginLeft:'15px',
          marginRight: '10px',
          paddingBottom:'10px',
          paddingTop:'15px',
          borderRight: '3px solid rgba(15, 15, 15, 0.3)',
          paddingRight: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',}}>
          <Typography variant="h6" gutterBottom>
            {totalProductionCost.label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" >
            {totalProductionCost.value}
          </Typography>
        </div>
        <div style={{ padding:'0px',
          margin:'0px',
          marginLeft:'15px',
          marginRight: '10px',
          paddingBottom:'10px',
          paddingTop:'15px',
          borderRight: '3px solid rgba(15, 15, 15, 0.3)',
          paddingRight: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', }}>
          <Typography variant="h6" gutterBottom>
            {totalEstimatedRevenue.label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" >
            {totalEstimatedRevenue.value}
          </Typography>
        </div>
        <div style={{ padding:'0px',
          margin:'0px',
          marginLeft:'15px',
          marginRight: '10px',
          paddingBottom:'10px',
          paddingTop:'15px',
          paddingRight: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          }}>
          <Typography variant="h6" gutterBottom>
            {totalCmdQuantity.label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" >
            {totalCmdQuantity.value}
          </Typography>
        </div>
    </div>
    <div style={{width:'100%', display:'flex', justifyContent:'center', gap:'10px'}}>
      
      <Card
        elevation={3}
        style={{
          marginBottom: '-50px',
          marginLeft:'10px',
          padding: 0,
          height: '335px',
        }}
      >
        <CardContent
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            height: '335',
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Client & Product Quantity Distribution
          </Typography>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              padding: 0,
              height:'270px'
            }}
          >
            {/* Donut Chart with Overlay */}
            <div
              style={{
                width: '100%',
                minWidth: 250,
                height: 300,
                position: 'relative',
              }}
            >
              {/* Overlay Label */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '30%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  zIndex: 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  align="center"
                  style={{ fontWeight: 'bold', whiteSpace: 'pre-line' }}
                >
                  {`Total\n${totalProdQuantity}`}
                </Typography>
              </div>

              {/* Chart Title */}
              <Typography variant="subtitle1" align="center">
                Client Quantity Share
              </Typography>

              {/* Donut Chart */}
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={clientData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label
                  >
                    {clientData.map((_, index) => (
                      <Cell
                        key={`client-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        elevation={3}
        style={{
          marginBottom: '-50px',
          marginLeft:'10px',
          padding: 0,
          height: '335px',
        }}
      >
        <CardContent
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            height: '335',
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Orders progress
          </Typography>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection:'column',
              flexWrap: 'wrap',
              padding: 0,
              height:'270px',
              justifyContent:'space-between'
            }}
          >
            {/* Donut Chart with Overlay */}
            <div
              style={{
                width: '100%',
                minWidth: 250,
                height: 300,
                position: 'relative',
              }}
            >
              {/* Overlay Label */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '32%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  zIndex: 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  align="center"
                  style={{ fontWeight: 'bold', whiteSpace: 'pre-line' }}
                >
                  {`Total\n${totalCmdOrders}`}
                </Typography>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value" 
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    label
                  >
                    {orderStatusData.map((_, index) => (
                      <Cell
                        key={`client-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        elevation={3}
        style={{
          marginBottom: '-50px',
          marginLeft:'10px',
          padding: 0,
          height: '335px',
        }}
      >
        <CardContent
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            height: '335',
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Orders progress
          </Typography>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              padding: 0,
              height:'270px'

            }}
          >
            {/* Donut Chart with Overlay */}
            <div
              style={{
                width: '100%',
                minWidth: 250,
                height: 300,
                position: 'relative',
                display:'flex',
                justifyContent:'space-between'
              }}
            >
              {/* Overlay Label */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '30%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  zIndex: 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  align="center"
                  style={{ fontWeight: 'bold', whiteSpace: 'pre-line' }}
                >
                  {`Total\n${totalCmdOrders}`}
                </Typography>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ProdStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    label
                  >
                    {ProdStatusData.map((_, index) => (
                      <Cell
                        key={`client-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ zIndex: 5}}/>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <Card elevation={3} style={{ width:'100%', marginTop: 65, marginLeft:10, marginBottom:15, padding:0, paddingBottom:0 }}>
      <CardContent style={{ paddingLeft:0, paddingRight:0, paddingBottom:2}}>
        <Typography variant="h6" align="center"  width="100%" gutterBottom>
            Product Quantity bar chart Distribution
        </Typography>
        {/* Product Quantity Donut */}
        <div style={{ margin:0, padding:0, width: '100%' ,height: 300}}>
          <div style={{ width: '100%', height:'25px'}}>
                {/* Custom Legend ABOVE the chart */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 12,
                    marginBottom: 10,
                  }}>
                  <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        gap: 16,
                        fontSize: 15,
                        fontWeight: 'bold'
                      }}>
                      <li key="item-0" style={{ color: '#8884d8', display: 'flex', alignItems: 'center' }}>
                        <span style={{
                            marginRight: 6,
                            display: 'inline-block',
                            width: 10,
                            height: 10,
                            backgroundColor: '#8884d8'
                          }}
                        />
                        Quantity
                      </li>
                      <li key="avg-line" style={{ color: 'rgb(106, 62, 62)', display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          marginRight: 6,
                          display: 'inline-block',
                          width: 30,
                          height: 1.5,
                          backgroundImage: 'repeating-linear-gradient(to right, rgb(106, 62, 62), rgb(106, 62, 62) 4px, transparent 4px, transparent 8px)'
                          }}
                          />
                        Average = {averageProductData.toFixed(2)}
                      </li>
                    </ul>
                </div>
              </div>
          <ResponsiveContainer width="95%" height="100%" style={{paddingLeft:10, paddingRight:10}}>              
              <BarChart data={productData}
              margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                <XAxis
                    dataKey="name" interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{fontSize:10, fontStyle:'italic'}}
                />
                <YAxis />
                <RechartsTooltip 
                />
                <Bar
                    dataKey="value"
                    fill="#8884d8"
                    barSize={120}
                />

                <ReferenceLine
                  y={averageProductData}
                  stroke="rgb(106, 62, 62)"
                  strokeDasharray="4 4"
                />
              </BarChart>
          </ResponsiveContainer>  
        </div>
      </CardContent>
    </Card>
    
    <div style={{  
      boxShadow: '0px 3px 5px -1px rgb(228, 231, 239), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
      padding: '0px',
      backgroundColor: 'white',
      marginBottom:"10px", marginLeft:"10px", width:'100%', display: 'flex' , marginTop:0, 
      borderRadius:'3px'
      }}>

        <div style={{ padding:'0px',
          margin:'0px',
          marginLeft:'15px',
          marginRight: '10px',
          paddingBottom:'10px',
          paddingTop:'15px',
          borderRight: '3px solid rgba(15, 15, 15, 0.3)',
          paddingRight: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',}}>
          <Typography variant="h6" gutterBottom>
            {kpis[0].label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" >
            {kpis[0].value}
          </Typography>
        </div>
        <div style={{ padding:'0px',
          margin:'0px',
          marginLeft:'15px',
          marginRight: '10px',
          paddingBottom:'10px',
          paddingTop:'15px',
          borderRight: '3px solid rgba(15, 15, 15, 0.3)',
          paddingRight: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',}}>
          <Typography variant="h6" gutterBottom>
            {kpis[1].label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" >
            {kpis[1].value}
          </Typography>
        </div>
        <div style={{ padding:'0px',
          margin:'0px',
          marginLeft:'15px',
          marginRight: '10px',
          paddingBottom:'10px',
          paddingTop:'15px',
          borderRight: '3px solid rgba(15, 15, 15, 0.3)',
          paddingRight: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',}}>
          <Typography variant="h6" gutterBottom>
            {kpis[2].label}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" >
            {kpis[2].value}
          </Typography>
        </div>
    </div>
    
    <div style={{margin:'0px', marginTop:'-60px', padding:'0px', display:'flex', flexDirection:'column', justifyContent:'center', width:'100%'}}>
      <Card elevation={3} style={{  marginTop: '67px', marginLeft:10, marginBottom:15, padding:0, paddingBottom:0 }}>
        <CardContent style={{ paddingLeft:0, paddingRight:0, paddingBottom:2}}>
          <Typography variant="h6" align="center" width="100%" gutterBottom>
              Product Quantity bar chart Distribution
          </Typography>
          {/* Product Quantity Donut */}
          <div style={{ margin:0, padding:0, width: '100%' ,height: 278 }}>
            <Typography variant="subtitle1" align="center">Product Quantity Share</Typography>
            
                <ResponsiveContainer width={'100%'} height={250}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="idx" name="Index" />
                    <YAxis type="number" dataKey="y" name="Value" />
                    <Tooltip content={<CustomTooltip />}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Legend />
                    
                    <Scatter name="Cost" data={costs} fill="#8884d8" shape={<DiamondShape />}/>
                    <Scatter name="Revenue" data={revenues} fill="#82ca9d" shape={<DiamondShape />}/>
                    <Scatter name="Gain" data={gains} fill="#ff7300" shape={<DiamondShape />}/>
                  </ScatterChart>
                </ResponsiveContainer></div>
          </CardContent>
      </Card>
      
        
      </div>
    </div>
  );
};

export default DashboardKPIs;
