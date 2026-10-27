import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Building,
  HeartHandshake,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Employee, TimeClockRecord, PayrollRecord } from '../../types';

export const HRModule: React.FC = () => {
  const {
    employees,
    timeClock,
    payroll,
    addEmployee,
    registerTimeClock,
    markPayrollPaid,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'COLABORADORES' | 'FOLHA' | 'PONTO' | 'BENEFICIOS'>('COLABORADORES');
  const [isNewEmpModalOpen, setIsNewEmpModalOpen] = useState(false);

  // New Employee Form State
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<Employee['department']>('COZINHA');
  const [baseSalary, setBaseSalary] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Total payroll cost
  const totalPayrollCost = payroll.reduce((sum, p) => sum + p.totalCostCompany, 0);
  const totalNetSalary = payroll.reduce((sum, p) => sum + p.netSalary, 0);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const sal = parseFloat(baseSalary);
    if (!name || isNaN(sal) || sal <= 0) {
      showToast('Preencha os dados obrigatórios do colaborador.', 'warning');
      return;
    }

    addEmployee({
      name,
      cpf: cpf || '000.000.000-00',
      role: role || 'Operador',
      department,
      admissionDate: new Date().toISOString().slice(0, 10),
      baseSalary: sal,
      benefits: {
        mealVoucher: 850.00,
        transportVoucher: 320.00,
        healthInsurance: 450.00
      },
      status: 'ATIVO',
      contact: {
        email: email || 'colaborador@mise.com.br',
        phone: phone || '(11) 90000-0000'
      }
    });

    setIsNewEmpModalOpen(false);
    setName('');
    setCpf('');
    setRole('');
    setBaseSalary('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('COLABORADORES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'COLABORADORES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quadro de Colaboradores ({employees.length})
          </button>
          <button
            onClick={() => setActiveSubTab('FOLHA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'FOLHA'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Folha de Pagamento & Encargos (DP)
          </button>
          <button
            onClick={() => setActiveSubTab('PONTO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'PONTO'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Controle de Ponto Digital ({timeClock.length})
          </button>
          <button
            onClick={() => setActiveSubTab('BENEFICIOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'BENEFICIOS'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gestão de Benefícios (VR / VT / Saúde)
          </button>
        </div>

        <button
          onClick={() => setIsNewEmpModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Admitir Colaborador</span>
        </button>
      </div>

      {/* VIEW 1: Colaboradores */}
      {activeSubTab === 'COLABORADORES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {emp.department}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  {emp.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{emp.name}</h4>
                <p className="text-xs text-amber-400 font-medium">{emp.role}</p>
                <p className="text-[10px] font-mono text-slate-500">CPF: {emp.cpf}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{emp.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{emp.contact.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Admissão: {emp.admissionDate}</span>
                <span className="font-mono font-bold text-white">
                  Salário Base: R$ {emp.baseSalary.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Folha de Pagamento & Encargos */}
      {activeSubTab === 'FOLHA' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Salários Líquidos a Pagar
              </span>
              <div className="text-2xl font-black text-white font-mono">
                R$ {totalNetSalary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Valor depositado na conta dos funcionários
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="text-xs font-bold uppercase text-amber-400 block mb-1">
                Custo Total da Folha (Empresa)
              </span>
              <div className="text-2xl font-black text-amber-300 font-mono">
                R$ {totalPayrollCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Inclui FGTS (8%), provisão de férias e 13º salário
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Período de Competência
              </span>
              <div className="text-2xl font-black text-white font-mono">
                10/2026 (Mensal)
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                Cálculos de retenção INSS/IRRF automáticos
              </span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Colaborador</th>
                    <th className="py-3 px-4 text-right">Salário Bruto</th>
                    <th className="py-3 px-4 text-right">INSS Retido</th>
                    <th className="py-3 px-4 text-right">IRRF Retido</th>
                    <th className="py-3 px-4 text-right">Benefícios</th>
                    <th className="py-3 px-4 text-right">Salário Líquido</th>
                    <th className="py-3 px-4 text-right">Custo Empresa</th>
                    <th className="py-3 px-4 text-center">Status / Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payroll.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{pay.employeeName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Ref: {pay.periodMonthYear}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-200">
                        R$ {pay.baseSalary.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-rose-300">
                        - R$ {pay.inssDeduction.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-rose-300">
                        - R$ {pay.irrfDeduction.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-rose-300">
                        - R$ {pay.benefitsDeduction.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        R$ {pay.netSalary.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-300 font-semibold">
                        R$ {pay.totalCostCompany.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {pay.status === 'PREVIA' ? (
                          <button
                            onClick={() => markPayrollPaid(pay.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-sm transition-all flex items-center gap-1 mx-auto"
                          >
                            <Check className="w-3 h-3" />
                            <span>Pagar</span>
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1 mx-auto w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            PAGO
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Controle de Ponto Digital */}
      {activeSubTab === 'PONTO' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Espelho de Ponto Eletrônico (Portaria 671 MTE)
              </h3>
              <p className="text-xs text-slate-400">
                Registro de jornadas, intervalos de alimentação e horas extras da equipe
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const emp = employees[0];
                  if (emp) registerTimeClock(emp.id, 'ENTRY');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Bater Ponto (Entrada)</span>
              </button>
              <button
                onClick={() => {
                  const emp = employees[0];
                  if (emp) registerTimeClock(emp.id, 'EXIT');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                <span>Bater Ponto (Saída)</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Colaborador</th>
                  <th className="py-3 px-4 text-center">Entrada</th>
                  <th className="py-3 px-4 text-center">Início Almoço</th>
                  <th className="py-3 px-4 text-center">Fim Almoço</th>
                  <th className="py-3 px-4 text-center">Saída</th>
                  <th className="py-3 px-4 text-center">Horas Extras</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {timeClock.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-slate-400">{tc.date}</td>
                    <td className="py-3 px-4 font-semibold text-white">{tc.employeeName}</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">
                      {tc.entryTime}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {tc.lunchStart}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{tc.lunchEnd}</td>
                    <td className="py-3 px-4 text-center font-mono text-rose-400">{tc.exitTime}</td>
                    <td className="py-3 px-4 text-center font-mono text-amber-300 font-semibold">
                      {tc.overtimeMinutes > 0 ? `+${tc.overtimeMinutes} min` : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          tc.status === 'HORA_EXTRA'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {tc.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: Gestão de Benefícios */}
      {activeSubTab === 'BENEFICIOS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <span className="text-xs font-bold uppercase text-amber-400 block">
              Vale Refeição / Alimentação (VR/VA)
            </span>
            <div className="text-xl font-mono font-bold text-white">R$ 850,00 /mês</div>
            <p className="text-xs text-slate-400">
              Disponibilizado via cartão Alelo / Ticket para toda a equipe de cozinha e salão.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <span className="text-xs font-bold uppercase text-blue-400 block">
              Vale Transporte (VT)
            </span>
            <div className="text-xl font-mono font-bold text-white">R$ 320,00 /mês</div>
            <p className="text-xs text-slate-400">
              Recarga automática do Bilhete Único / EMTU para deslocamento residência-trabalho.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <span className="text-xs font-bold uppercase text-emerald-400 block">
              Plano de Saúde & Odontológico
            </span>
            <div className="text-xl font-mono font-bold text-white">Coparticipação 20%</div>
            <p className="text-xs text-slate-400">
              Convênio médico Bradesco Saúde com cobertura ambulatorial e hospitalar.
            </p>
          </div>
        </div>
      )}

      {/* Modal: Admitir Colaborador */}
      {isNewEmpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Admitir Novo Colaborador</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Departamento</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="COZINHA">Cozinha</option>
                    <option value="ATENDIMENTO">Atendimento / Salão</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                    <option value="FINANCEIRO">Financeiro</option>
                    <option value="LOGISTICA">Logística / Estoque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Cargo</label>
                  <input
                    type="text"
                    placeholder="Ex: Cozinheiro Júnior"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Salário Base (R$)</label>
                  <input
                    type="number"
                    step="50"
                    min="1412"
                    required
                    placeholder="3000.00"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="colaborador@mise.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 98888-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewEmpModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Registrar Admissão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
