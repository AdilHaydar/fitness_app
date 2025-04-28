declare module 'react-native-pie' {
    interface Section {
        percentage: number;
        color: string;
    }

    interface PieChartProps {
        radius?: number;
        series: number[]; // 'series' özelliğini zorunlu hale getirdik
        colors?: string[];
        doughnut?: boolean;
        innerRadius?: number;
        sections: Section[]; // sections özelliğini de ekledik
        strokeCap?: string; // strokeCap özelliğini ekledik
    }

    const Pie: React.FC<PieChartProps>;
    export default Pie;
}
