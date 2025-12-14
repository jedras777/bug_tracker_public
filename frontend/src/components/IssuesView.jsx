// src/components/IssuesView.jsx
import { useEffect, useState } from 'react';
import { fetchIssues, createIssue, updateIssue } from '../api/issues';
import { apiRequest } from '../api/client';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'DONE'];

export function IssuesView() {
  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState(null);

  const [filters, setFilters] = useState({
    status: '',
    project: '',
    ordering: '-created_at',
  });

  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    project: '',
    title: '',
    description: '',
    status: 'OPEN',
  });
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await apiRequest('/api/projects/', { auth: true });
        setProjects(data.results || []);
      } catch (err) {
        console.error('Error loading projects', err);
      }
    }
    loadProjects();
  }, []);

  async function loadIssues() {
    setIssuesLoading(true);
    setIssuesError(null);

    try {
      const data = await fetchIssues(filters);
      setIssues(data.results || []);
    } catch (err) {
      console.error('Error loading issues', err);
      setIssuesError('Nie udało się pobrać zgłoszeń.');
    } finally {
      setIssuesLoading(false);
    }
  }

  useEffect(() => {
    loadIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.project, filters.ordering]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleCreateIssue(e) {
    e.preventDefault();
    setFormError(null);

    if (!form.project || !form.title) {
      setFormError('Project i Title są wymagane');
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        project: Number(form.project),
        title: form.title,
        description: form.description,
        status: form.status,
      };

      const newIssue = await createIssue(payload);
      setIssues(prev => [newIssue, ...prev]);

      setForm(prev => ({
        ...prev,
        title: '',
        description: '',
        status: 'OPEN',
      }));
    } catch (err) {
      console.error('Error creating issue', err);
      setFormError('Nie udało się utworzyć issue.');
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const updated = await updateIssue(id, { status: newStatus });
      setIssues(prev =>
        prev.map(issue => (issue.id === id ? updated : issue))
      );
    } catch (err) {
      console.error('Error updating issue status', err);
    }
  }

  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '32px',
        alignItems: 'flex-start',
        fontSize: '18px',
      }}
    >
      {/* LEWA KOLUMNA: formularz + filtry */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Kafelek: nowe issue */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            boxSizing: 'border-box',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: '16px',
              fontSize: '24px',
            }}
          >
            Nowe issue
          </h2>

          <form onSubmit={handleCreateIssue}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                Project
              </label>
              <select
                name="project"
                value={form.project}
                onChange={handleFormChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">-- wybierz projekt --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px 14px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              >
                {STATUSES.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {formError && (
              <div style={{ color: 'red', marginBottom: 12 }}>{formError}</div>
            )}

            <button
              type="submit"
              disabled={formSubmitting}
              style={{
                marginTop: '8px',
                padding: '10px 18px',
                fontSize: '16px',
                borderRadius: '999px',
                border: 'none',
                cursor: formSubmitting ? 'default' : 'pointer',
                backgroundColor: '#2563eb',
                color: '#fff',
              }}
            >
              {formSubmitting ? 'Zapisywanie...' : 'Dodaj issue'}
            </button>
          </form>
        </div>

        {/* Kafelek: filtry */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            boxSizing: 'border-box',
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: '16px',
              fontSize: '20px',
            }}
          >
            Filtry
          </h3>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Status</label>
            <select
              value={filters.status}
              onChange={e =>
                setFilters(prev => ({ ...prev, status: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            >
              <option value="">(wszystkie)</option>
              {STATUSES.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Project</label>
            <select
              value={filters.project}
              onChange={e =>
                setFilters(prev => ({ ...prev, project: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            >
              <option value="">(wszystkie)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>
              Ordering
            </label>
            <select
              value={filters.ordering}
              onChange={e =>
                setFilters(prev => ({ ...prev, ordering: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            >
              <option value="-created_at">Najnowsze</option>
              <option value="created_at">Najstarsze</option>
              <option value="status">Status A→Z</option>
              <option value="-status">Status Z→A</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRAWA KOLUMNA: lista issues */}
      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Issues</h2>

        {issuesLoading && <p>Ładowanie...</p>}
        {issuesError && <p style={{ color: 'red' }}>{issuesError}</p>}

        {!issuesLoading && issues.length === 0 && (
          <p>Brak zgłoszeń dla danych filtrów.</p>
        )}

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {issues.map(issue => (
            <li
              key={issue.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <strong style={{ fontSize: '20px' }}>
                  #{issue.id} {issue.title}
                </strong>

                <select
                  value={issue.status}
                  onChange={e =>
                    handleStatusChange(issue.id, e.target.value)
                  }
                  style={{
                    fontSize: '16px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                  }}
                >
                  {STATUSES.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {issue.description && (
                <p
                  style={{
                    marginTop: '8px',
                    marginBottom: '8px',
                    fontSize: '16px',
                  }}
                >
                  {issue.description}
                </p>
              )}

              <small style={{ fontSize: '14px', color: '#555' }}>
                Project ID: {issue.project} • Created by: {issue.created_by}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
