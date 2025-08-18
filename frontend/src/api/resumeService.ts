import axios from 'axios';

export const analyseResume = async (file:File):Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
     try{
         const {data} = await axios.post<AnalysisResponse>(
             'http://localhost:5000/analyse',
             formData,
             {
                 headers: {'Content-Type': 'multipart/form-data'},
                 timeout: 10000
             }
         );
         return data;
     }catch(error){
         if (axios.isAxiosError(error)) {
             throw new Error(error.response?.data.error || 'Network Error');
         }
         throw new Error('Analysis failed');
     }
};