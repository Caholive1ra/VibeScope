import { apiClient } from './apiClient';

export const projetosApi = {
  listProjetos: async () => {
    const response = await apiClient.get('/api/v1/projetos');
    return response.data;
  },

  createProjeto: async (payload) => {
    const response = await apiClient.post('/api/v1/projetos', payload);
    return response.data;
  },

  getProjectByMagicToken: async (magicToken) => {
    const response = await apiClient.get(`/api/v1/projetos/magic/${magicToken}`);
    return response.data;
  },

  getTimelineByMagicToken: async (magicToken) => {
    const response = await apiClient.get(`/api/v1/projetos/magic/${magicToken}/timeline`);
    return response.data;
  },

  submitFeedback: async (magicToken, payload) => {
    const response = await apiClient.post(
      `/api/v1/projetos/magic/${magicToken}/feedback`,
      payload,
    );
    return response.data;
  },

  getTarefasDaRodada: async (projetoId, rodadaId) => {
    const response = await apiClient.get(
      `/api/v1/projetos/${projetoId}/rodadas/${rodadaId}/tarefas`,
    );
    return response.data;
  },

  regerarResumo: async (projetoId) => {
    const response = await apiClient.post(`/api/v1/projetos/${projetoId}/resumo`);
    return response.data;
  },

  entregarRodada: async (projetoId, rodadaId, payload) => {
    const response = await apiClient.post(
      `/api/v1/projetos/${projetoId}/rodadas/${rodadaId}/entrega`,
      payload,
    );
    return response.data;
  },
};

