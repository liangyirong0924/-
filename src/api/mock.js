import Mock from 'mockjs'
import homeApi from './mockServeData/home'
Mock.mock('/lyr/api/home/getData',homeApi.getStatisticalData)