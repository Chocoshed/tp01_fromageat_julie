// Script de gestion du formulaire d'inscription
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Créer un conteneur pour les messages d'erreur
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
    errorContainer.style.cssText = `
        color: #e74c3c;
        background-color: #ffeaea;
        border: 1px solid #e74c3c;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 20px;
        display: none;
        font-size: 14px;
        line-height: 1.4;
    `;
    form.insertBefore(errorContainer, form.firstChild);
    
    // Créer le conteneur pour la page récapitulative
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'summary-container';
    summaryContainer.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        display: none;
        animation: fadeInUp 0.6s ease-out;
    `;
    document.body.appendChild(summaryContainer);
    
    // Gestionnaire de soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Nettoyer les messages d'erreur précédents
        clearErrors();
        
        // Récupérer les valeurs des champs
        const formData = getFormData();
        
        // Valider les données
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            displayErrors(errors);
        } else {
            showSummaryPage(formData);
        }
    });
    
    // Fonction pour récupérer les données du formulaire
    function getFormData() {
        return {
            login: document.getElementById('login').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            nom: document.getElementById('nom').value.trim(),
            prenom: document.getElementById('prenom').value.trim(),
            adresse: document.getElementById('adresse').value.trim(),
            email: document.getElementById('email').value.trim(),
            telephone: document.getElementById('telephone').value.trim(),
            dateNaissance: document.getElementById('dateNaissance').value
        };
    }
    
    // Fonction de validation du formulaire
    function validateForm(data) {
        const errors = [];
        
        // Vérifier que tous les champs sont remplis
        const requiredFields = [
            { field: 'login', label: 'Login' },
            { field: 'password', label: 'Mot de passe' },
            { field: 'confirmPassword', label: 'Confirmation du mot de passe' },
            { field: 'nom', label: 'Nom' },
            { field: 'prenom', label: 'Prénom' },
            { field: 'adresse', label: 'Adresse' },
            { field: 'email', label: 'Email' },
            { field: 'telephone', label: 'Téléphone' },
            { field: 'dateNaissance', label: 'Date de naissance' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]) {
                errors.push(`Le champ "${label}" est obligatoire.`);
            }
        });
        
        // Vérifier la validité de l'email
        if (data.email && !isValidEmail(data.email)) {
            errors.push('L\'adresse email n\'est pas valide.');
        }
        
        // Vérifier le format du numéro de téléphone
        if (data.telephone && !isValidPhoneNumber(data.telephone)) {
            errors.push('Le numéro de téléphone doit être au format 0600000000 (10 chiffres commençant par 0).');
        }
        
        // Vérifier que les mots de passe correspondent
        if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
            errors.push('Le mot de passe et sa confirmation ne correspondent pas.');
        }
        
        // Vérifier la longueur minimale du mot de passe
        if (data.password && data.password.length < 6) {
            errors.push('Le mot de passe doit contenir au moins 6 caractères.');
        }
        
        // Vérifier la date de naissance (pas dans le futur)
        if (data.dateNaissance) {
            const today = new Date();
            const birthDate = new Date(data.dateNaissance);
            if (birthDate > today) {
                errors.push('La date de naissance ne peut pas être dans le futur.');
            }
        }
        
        return errors;
    }
    
    // Fonction de validation d'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Fonction de validation du numéro de téléphone français
    function isValidPhoneNumber(phone) {
        // Supprimer tous les espaces, tirets et autres caractères non numériques
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        
        // Vérifier que c'est exactement 10 chiffres commençant par 0
        const phoneRegex = /^0[1-9][0-9]{8}$/;
        return phoneRegex.test(cleanPhone);
    }
    
    // Fonction pour afficher les erreurs
    function displayErrors(errors) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.innerHTML = `
            <strong>Erreurs détectées :</strong>
            <ul style="margin: 8px 0 0 20px;">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        errorContainer.style.display = 'block';
        
        // Faire défiler vers le haut pour voir les erreurs
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Fonction pour nettoyer les erreurs
    function clearErrors() {
        const errorContainer = document.getElementById('error-container');
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
    }
    
    // Fonction pour afficher la page récapitulative
    function showSummaryPage(data) {
        const summaryContainer = document.getElementById('summary-container');
        
        // Masquer le formulaire
        form.style.display = 'none';
        
        // Créer le contenu de la page récapitulative
        summaryContainer.innerHTML = `
            <h2 style="color: #333; margin-bottom: 30px; text-align: center; font-size: 24px;">
                Récapitulatif de votre inscription
            </h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Login :</strong>
                    <span style="margin-left: 10px;">${escapeHtml(data.login)}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Nom :</strong>
                    <span style="margin-left: 10px;">${escapeHtml(data.nom)}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Prénom :</strong>
                    <span style="margin-left: 10px;">${escapeHtml(data.prenom)}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Adresse :</strong>
                    <span style="margin-left: 10px;">${escapeHtml(data.adresse)}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Email :</strong>
                    <span style="margin-left: 10px;">${escapeHtml(data.email)}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #555;">Téléphone :</strong>
                    <span style="margin-left: 10px;">${escapeHtml(data.telephone)}</span>
                </div>
                <div style="margin-bottom: 0;">
                    <strong style="color: #555;">Date de naissance :</strong>
                    <span style="margin-left: 10px;">${formatDate(data.dateNaissance)}</span>
                </div>
            </div>
            <div style="text-align: center;">
                <button type="button" id="backToForm" style="
                    background: #6c757d;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    margin-right: 10px;
                    transition: all 0.3s ease;
                ">Modifier les informations</button>
                <button type="button" id="confirmRegistration" style="
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Confirmer l'inscription</button>
            </div>
        `;
        
        // Afficher la page récapitulative
        summaryContainer.style.display = 'block';
        
        // Gestionnaire pour retourner au formulaire
        document.getElementById('backToForm').addEventListener('click', function() {
            summaryContainer.style.display = 'none';
            form.style.display = 'block';
            clearErrors();
            clearForm();
        });
        
        // Gestionnaire pour confirmer l'inscription
        document.getElementById('confirmRegistration').addEventListener('click', function() {
            alert('Inscription confirmée ! Merci pour votre inscription.');
            // Ici, on pourrait envoyer les données à un serveur
            // Pour l'instant, on recharge simplement le formulaire
            location.reload();
            clearForm();
        });
        
        // Faire défiler vers le haut
        summaryContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Fonction pour échapper les caractères HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Fonction pour formater la date
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Fonction pour vider le formulaire
    function clearForm() {
        // Vider tous les champs de saisie
        document.getElementById('login').value = '';
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('nom').value = '';
        document.getElementById('prenom').value = '';
        document.getElementById('adresse').value = '';
        document.getElementById('email').value = '';
        document.getElementById('telephone').value = '';
        document.getElementById('dateNaissance').value = '';
        
        // Réinitialiser les classes de validation visuelles si elles existent
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
    }
});