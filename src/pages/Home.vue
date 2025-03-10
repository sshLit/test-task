<template>
  <div class="container">
    <h2>Список постов</h2>
    <table v-if="paginatedPosts.length" class="post-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Заголовок</th>
        <th>Описание</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="post in paginatedPosts" :key="post.id">
        <td>{{ post.id }}</td>
        <td>{{ post.title }}</td>
        <td>{{ post.body }}</td>
      </tr>
      </tbody>
    </table>

    <p v-else class="loading">{{ isLoading ? 'Загрузка данных' : 'Нет данных для отображения' }}</p>

    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="currentPage === 1" @click="goToPage(1)">Первая</button>
      <button v-for="page in displayedPages" :key="page"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)">
        {{ page }}
      </button>
      <button :disabled="currentPage === totalPages" @click="goToPage(totalPages)">Последняя</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  // Обычно пишу через script setup, но не всем реализация нравиться, поэтому воспользуемся стандартной
  setup() {
    const posts = ref([]);
    const currentPage = ref(1);
    // Здесь мы можем настроить наше приложение, как и требовалось в тз
    const itemsPerPage = 10; // кол-во записей на странице
    const maxPageLinks = 5; // сколько лиенокв отображаеи на странице
    //
    const isLoading = ref(true);

    const route = useRoute(); // немного костыльные названия...
    const router = useRouter();

    // Загрузка наших постов на странице, используем обычный фетч, ну лучше, например, axios
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('err');
        posts.value = await response.json();
      } catch (error) {
        console.error(error.message);
      } finally {
        isLoading.value = false;
      }
    };
    const totalPages = computed(() => Math.ceil(posts.value.length / itemsPerPage));
    /*
        const totalPages = computed(() => Math.ceil(posts.value.length / itemsPerPage.value));

        const paginatedPosts = computed(() => {
          const start = (currentPage.value - 1) * itemsPerPage.value;
          console.log("2", start, posts.value.slice(start, start + itemsPerPage.value );
          return posts.value.slice(start, start + itemsPerPage.value);
        });

        const displayedPages = computed(() => {
          let start = Math.max(1, currentPage.value - Math.floor(maxPageLinks.value / 2));
          let end = Math.min(totalPages.value, start + maxPageLinks.value - 1);

          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        });
    */

    const paginatedPosts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return posts.value.slice(start, start + itemsPerPage);
    });

    const displayedPages = computed(() => {
      const half = Math.floor(maxPageLinks / 2);
      let start = Math.max(1, currentPage.value - half);
      let end = Math.min(totalPages.value, start + maxPageLinks - 1);
      console.log("2", start, end, half );

      if (end - start + 1 < maxPageLinks) {
        start = Math.max(1, end - maxPageLinks + 1);
        console.log("3", start);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        router.push({ query: { page } });
      }
    };

    watch(
        () => route.query.page,
        (newPage) => {
          const page = parseInt(newPage, 10);
          if (!isNaN(page) && page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
          }
        }
    );

    onMounted(fetchPosts);

    return {
      posts,
      paginatedPosts,
      currentPage,
      totalPages,
      displayedPages,
      goToPage,
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 900px;
  margin: 30px auto;
  padding: 25px;
  font-family: 'Arial', sans-serif;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
}
.h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
}

.post-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

.post-table th,
.post-table td {
  border: 1px solid #e1e1e1;
  padding: 12px;
  text-align: left;
}

.post-table th {
  background: #007bff;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
}

.post-table tbody tr:nth-child(odd) {
  background-color: #f8f9fa;
}

.post-table tbody tr:hover {
  background-color: #f1f1f1;
  transition: background 0.2s ease-in-out;
}

.loading {
  font-size: 20px;
  color: #888;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 25px;
}

button {
  padding: 8px 14px;
  border: 1px solid #007bff;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.active {
  background: #ff0000;
  border-color: #ff0000;
  color: white;
}

@media (max-width: 600px) {
  .post-table th,
  .post-table td {
    padding: 8px;
    font-size: 14px;
  }

  button {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>