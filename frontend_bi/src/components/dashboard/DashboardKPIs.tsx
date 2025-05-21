import React from 'react';
import { ProductionFlat } from '../../types/ProductionType';
import { Commande } from '../../types/CommandeType';
import { Equipe } from '../../types/EquipesType';
import { Stock } from '../../types/stocksType';
import { ChartCard } from '../ui/ChartCard';
import PieChartCard from '../ui/PieChartCard';
import ProductQuantityHistogramDistribution from '../charts/ProductHistogramDistribution';
import TotalFinancialMetricsPerProduct from '../charts/TotalFinancialMetricsPerProductScatterCHart';
import KPIBox from '../ui/KPIBox';
import { useProductionKPIs } from './useProductionKPIs';
import { useCommandeKPIs } from './useCommandeKPIs';
import { useEquipesKPIs } from './useEquipesKPIS';
import { useStocksPIs } from './useStocksKPIs';
import StockQuantityBarChart from '../charts/StockQuantityBarChart';
import HeatMapCharts from '../charts/TeamsHeatMaps';

interface Props {
  productions: ProductionFlat[];
  commandes: Commande[];
  stocks: Stock[],
  equipes: Equipe[]
}

  const DashboardKPIs: React.FC<Props> = ({ productions, commandes, stocks, equipes}) => {
  

  // Production KPIs
  const {
    totalProdQuantity,
    prodTotalCost,
    prodAverageUnitPrice,
    ProdAverageUnitCost,
    ProdAverageProductionTime,
    productData,
    ProdStatusData,
    mostProducedProduct,
    prodTotalRevenuePerUnit,
    averageProductData,
    prodCount,
    costs,
    gains,
    revenues
  } = useProductionKPIs(productions);

  // Commande KPIs
  const {
      totalCmdOrders,
      totalCmdOrderedQuantity,
      orderStatusData,
      clientData,
      topClientbycmd,
    }= useCommandeKPIs(commandes)

  // Stocks KPIs
  const {
    totalStockKPI,
    stockByLocationDonutData,
    stockByMaterialBarData,
    stockBarLocations,
    totalStockByMaterial
  }= useStocksPIs(stocks)

  const sortedStockByLocationDonutData = [...stockByLocationDonutData].sort((a, b) =>
  a.name.localeCompare(b.name)
  );

  // Equipes KPIs
  const {
    heatmapDataAvailability,
    heatmapDataWorkHours,
    heatmapDataStaff
  }= useEquipesKPIs(equipes)


  const formatNumber = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const topClientbyOrder= { label: 'Meilleur client (par commande)', value: topClientbycmd }
  const mostProducedProd= { label: 'Produit le plus fabriqué', value: mostProducedProduct }
  const totalProductionCost= { label: 'Coût total de production', value: `${formatNumber(prodTotalCost)} €` }
  const totalEstimatedRevenue= { label: 'Revenu estimé total', value: `${formatNumber(prodTotalRevenuePerUnit)} €` }
  const totalCmdQuantity  ={ label: 'Quantité totale commandée', value: formatNumber(totalCmdOrderedQuantity) }

  const KPIs1= [
    topClientbyOrder,
    mostProducedProd,
    totalProductionCost,
    totalEstimatedRevenue,
    totalCmdQuantity
    ]

  const KPIs2 = [
    { label: 'Temps moyen de production / unité', value: `${formatNumber(ProdAverageProductionTime)} h` },
    { label: 'Coût moyen de production / unité', value: `${formatNumber(ProdAverageUnitCost)} €` },
    { label: 'Prix moyen de vente / unité', value: `${formatNumber(prodAverageUnitPrice)} €` },
    { label: 'Quantité totale en stock', value: `${totalStockKPI.value}` },
  ];

    const sortedStockByMaterialBarData = [...stockByMaterialBarData].sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    const sortedStockBarLocations = [...stockBarLocations].sort((a, b) =>
      a.localeCompare(b)
    );

    const sortedTotalStockByMaterial = [...totalStockByMaterial].sort((a, b) =>
      a.label.localeCompare(b.label)
    );


  return (
    <div style={{ display: 'flex' , flexDirection:'column', padding:0,  width:"100%", backgroundColor:"rgb(228, 231, 239)"}}>
      <KPIBox kpis={KPIs1} finalRightBorderFlagOff={true} style={{marginTop:'0px'}}></KPIBox>
      <ChartCard 
        title='Distribution de la quantité des produits'
        style={{
            width:'100%',
            marginTop: 20,
            marginLeft:10,
            marginBottom:0,
            padding:0,
            paddingBottom:0
          }}
        children={<ProductQuantityHistogramDistribution averageProductData={averageProductData} productData={productData}/>}
      >
      </ChartCard>

      <div style={{margin:'0px', marginTop:'0px', marginBottom: '0px', padding:'0px',  width:'100%'}}>
        <ChartCard
          title='Indicateurs financiers par produit'
          style={{ 
            marginTop: '20px',
            marginLeft:10,
            marginBottom:15,
            padding:0,
            paddingBottom:0,
          }}
          children={<TotalFinancialMetricsPerProduct costs={costs} gains={gains} revenues={revenues}/>}
        >
        </ChartCard>
      </div>

      <KPIBox kpis={KPIs2} finalRightBorderFlagOff={true} style={{marginTop:'30px'}}></KPIBox>

      <div style={{
        height:'100%',
        width:'100%',
        marginTop:'20px',
        display:'flex',
        justifyContent:'center',
        gap:'0px',
        boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
        borderRadius: '2px',
        paddingTop:'15px',
        backgroundColor: 'white',
        marginLeft:'10px',
        marginBottom:'15px'
        }}>
    
        <PieChartCard
          info={`${totalProdQuantity}`}
          title={'Distribution des production par clients'}
          subtitle={'Client Quantity Share'}
          data={clientData}
          InfoVspace={25}
          >
        </PieChartCard>

        <PieChartCard
          title={'Progression des commandes'}
          subtitle={null}
          info={`${totalCmdOrders}`}
          data={orderStatusData}
          InfoVspace={25}
          style={{minWidth:'285px'}}
          >
        </PieChartCard>
    
        <PieChartCard
          title={'Progression des productions'}
          subtitle={null}
          info={`${prodCount}`}
          data={ProdStatusData}
          InfoVspace={25}
          >
        </PieChartCard>

        <PieChartCard
              style={{minHeight:'200px', minWidth:'360px'}}
              info={`${totalStockKPI.value}`}
              title={'Distribution des produits par entrepôt'}
              subtitle={null}
              data={sortedStockByLocationDonutData}
              InfoVspace={25}>
            </PieChartCard>
      </div>
    
        <div style={{width:'100%', display:'flex', flexDirection:'column',justifyContent:'center', gap:'10px'}}>
          <div style={{width:'100%', display:'flex', justifyContent:'center', gap:'10px'}}>
            

            <ChartCard 
              title='Distribution des types de Matières par entrepôt'
              style={{
                  width:'100%',
                  marginTop: 5,
                  marginLeft:10,
                  marginBottom:15,
                  padding:0,
                  paddingBottom:0,
                  paddingLeft:'0px',
                }}
              children={<StockQuantityBarChart data={sortedStockByMaterialBarData} locations={sortedStockBarLocations} totalStockByMaterial= {sortedTotalStockByMaterial}></StockQuantityBarChart>}
            >
            </ChartCard>
          </div>
        <div style={{
            marginLeft: '10px',
            height:'550px',
            backgroundColor:'white',
            boxShadow:
              '0px 3px 5px -1px rgb(228, 231, 239),0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
            padding: '0px',
            marginBottom: '10px',
            display: 'flex',
            borderRadius: '3px',
        }}>
          <HeatMapCharts
            Availabilitydata={heatmapDataAvailability}
            WorkHoursdata={heatmapDataWorkHours}
            Staffdata={heatmapDataStaff}
          >  
          </HeatMapCharts>
        </div>
      </div>
    </div>
  );
};

export default DashboardKPIs;