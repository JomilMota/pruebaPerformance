import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 0 }
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.05']
    }
};

export default function () {
    const response = http.get(
        'https://fakestoreapi.com/products'
    );

    check(response, {
        'Status 200': (r) => r.status === 200,
        'Tiempo < 1 segundo': (r) => r.timings.duration < 1000
    });

    sleep(1);
}

export function handleSummary(data) {
  return {
    "reporte.html": htmlReport(data, {
        title: "Reporte Performance"
    }),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
