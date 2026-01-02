
import chartPlugin from '../../index';
import Chart from '@toast-ui/chart';

jest.mock('@toast-ui/chart', () => {
    const mockFn = jest.fn().mockImplementation(() => ({
        destroy: jest.fn(),
    }));
    (mockFn as any).barChart = jest.fn();
    (mockFn as any).columnChart = jest.fn();
    return mockFn;
});

describe('chartPlugin Lifecycle', () => {
    let plugin: any;

    beforeEach(() => {
        jest.useFakeTimers();
        // Reset mocks
        (Chart as any).barChart.mockClear();
        (Chart as any).columnChart.mockClear();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should render multiple charts in the same event loop tick', () => {
        plugin = chartPlugin({ usageStatistics: false } as any, {} as any);
        const renderer = plugin.toHTMLRenderers.chart;

        // Simulate rendering two charts
        const node1 = { literal: ',c1\nd1,10' };
        const node2 = { literal: ',c2\nd2,20' };

        const html1 = renderer(node1);
        const html2 = renderer(node2);

        // Extract IDs from HTML (attributes: { 'data-chart-id': id })
        const id1 = html1[0].attributes['data-chart-id'];
        const id2 = html2[0].attributes['data-chart-id'];

        // Create container elements in DOM so renderChart finds them
        const div1 = document.createElement('div');
        div1.setAttribute('data-chart-id', id1);
        document.body.appendChild(div1);

        const div2 = document.createElement('div');
        div2.setAttribute('data-chart-id', id2);
        document.body.appendChild(div2);

        // Fast-forward timers to trigger renderChart
        jest.runAllTimers();

        // Expect Chart factory to be called twice
        // We don't know which specific chart type it picks by default (bar or column), but default is column.
        // The code says: chartOptions.editorChart.type = chartOptions.editorChart.type || 'column';
        // const toastuiChart = chart[chartType];
        // chart map: const chart = { bar: Chart.barChart, column: Chart.columnChart, ... }

        // Check if columnChart was called
        const columnChartMock = (Chart as unknown as any).columnChart;

        // DEBUG: Print calls
        console.log('ColumnChart calls:', columnChartMock.mock.calls.length);

        expect(columnChartMock).toHaveBeenCalledTimes(2);
    });
});
